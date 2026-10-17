// chat-backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import { aiReply } from "./ai/claude.js";
import { detectIntent } from "./intents/intentDetector.js";
import { sendLeadEmail } from "./mailer.js";
import { customerTransaction, getConversation, newConversation, publicConversation, cleanDraft, draftRevision, saveConfirmedRequest, validVisitor } from "./assistant-store.js";
import { deliverPendingRequests, notificationConfigured } from "./assistant-notifications.js";

const app = express();

// ---- Config (ENV öncelikli) ----
const requestBuckets = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 25;

app.set("trust proxy", 1);

// CORS: sadece izinli origin'ler
const allowedOrigins = String(
  process.env.CORS_ORIGINS ||
    "https://seruretim.com,https://www.seruretim.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // server-to-server / curl / healthcheck gibi origin olmayan istekler
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS_NOT_ALLOWED"), false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Session-Id", "X-Visitor-Token"],
    credentials: false,
    maxAge: 600,
  })
);

app.use(express.json({ limit: "64kb" }));

app.use("/api", (req, res, next) => {
  const key = String(req.ip || req.socket?.remoteAddress || "unknown");
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || now - bucket.startedAt > RATE_WINDOW_MS) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT) {
    const language = req.body?.language === "en" ? "en" : "tr";
    return res.status(429).json({
      error: "RATE_LIMIT",
      reply:
        language === "en"
          ? "Too many requests were sent. Please try again shortly."
          : "Çok fazla istek gönderildi. Lütfen kısa bir süre sonra tekrar deneyin.",
    });
  }

  return next();
});

// Sağlık kontrolü
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "ser-plastik-chat-backend" });
});

const visitorToken = req => req.headers["x-visitor-token"];
const assistantFailure = (res, error) => {
  const code = ["INVALID_VISITOR", "CONVERSATION_NOT_FOUND", "DRAFT_CHANGED", "INCOMPLETE_DRAFT"].includes(error.message) ? error.message : "ASSISTANT_UNAVAILABLE";
  const status = code === "CONVERSATION_NOT_FOUND" ? 404 : code === "DRAFT_CHANGED" ? 409 : code === "ASSISTANT_UNAVAILABLE" ? 503 : 400;
  if (status === 503) console.error("LINA_OPERATION_UNAVAILABLE");
  return res.status(status).json({ error: code });
};

app.post("/api/assistant/session", async (req, res) => {
  try {
    const data = await customerTransaction(visitorToken(req), customer => {
      const conversation = req.body?.fresh ? newConversation(customer, req.body?.language === "en" ? "en" : "tr") : getConversation(customer, req.body?.conversationId, req.body?.language);
      return { conversation: publicConversation(conversation), conversations: customer.conversations.slice(-50).map(item => ({ id: item.id, createdAt: item.createdAt, title: item.summary.slice(0, 90) || item.messages.find(m => m.role === "user")?.content.slice(0, 90) || "" })) };
    });
    return res.json(data);
  } catch (error) { return assistantFailure(res, error); }
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim().slice(0, 600);
  const language = req.body?.language === "en" ? "en" : "tr";
  if (!message) return res.status(400).json({ reply: language === "en" ? "Message cannot be empty." : "Mesaj boş olamaz." });
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) return res.status(503).json({ error: "ASSISTANT_NOT_CONFIGURED", reply: language === "en" ? "Lina is temporarily unavailable." : "Lina şu anda kullanılamıyor." });
  try {
    if (!visitorToken(req)) {
      const history = Array.isArray(req.body?.history) ? req.body.history.slice(-50) : [];
      const result = await aiReply(message, detectIntent(message), history, language);
      return res.json({ reply: result.reply, memorySaved: false });
    }
    const requestId = String(req.body?.requestId || "");
    if (!validVisitor(visitorToken(req)) || !/^[a-f0-9-]{36}$/.test(requestId)) return res.status(400).json({ error: "INVALID_VISITOR_OR_REQUEST" });
    const result = await customerTransaction(visitorToken(req), async customer => {
      const conversation = getConversation(customer, req.body?.conversationId, language);
      const receipt = conversation.receipts.find(item => item.id === requestId);
      if (receipt) return { reply: receipt.reply, memorySaved: true, conversation: publicConversation(conversation) };
      conversation.language = language;
      const memory = { requestId: conversation.requestId || null, draft: conversation.draft, pastConversations: customer.conversations.filter(item => item.id !== conversation.id).slice(-50).map(item => ({ summary: item.summary, requestId: item.requestId || null })) };
      const generated = await aiReply(message, detectIntent(message), conversation.messages.slice(-50), language, memory);
      const draft = cleanDraft(generated.draft);
      if (draftRevision(draft) !== draftRevision(conversation.draft)) conversation.requestId = null;
      conversation.draft = draft;
      conversation.summary = generated.summary;
      conversation.updatedAt = new Date().toISOString();
      conversation.messages.push({ role: "user", content: message }, { role: "assistant", content: generated.reply });
      conversation.messages = conversation.messages.slice(-50);
      const response = { reply: generated.reply, memorySaved: true, conversation: publicConversation(conversation) };
      conversation.receipts.push({ id: requestId, reply: generated.reply });
      return response;
    });
    return res.json(result);
  } catch (error) { return assistantFailure(res, error); }
});

app.post("/api/assistant/request", async (req, res) => {
  if (req.body?.confirmed !== true) return res.status(400).json({ error: "EXPLICIT_CONFIRMATION_REQUIRED" });
  try {
    const result = await customerTransaction(visitorToken(req), async (customer, owner) => {
      const conversation = getConversation(customer, req.body?.conversationId, req.body?.language);
      return saveConfirmedRequest(customer, owner, conversation, req.body?.revision);
    });
    void deliverPendingRequests().catch(() => console.error("LINA_NOTIFICATION_RETRY_PENDING"));
    return res.json({ ...result, notification: notificationConfigured() ? "queued" : "pending_configuration" });
  } catch (error) { return assistantFailure(res, error); }
});

app.post("/api/assistant/forget", async (req, res) => {
  try {
    await customerTransaction(visitorToken(req), customer => { customer.conversations = []; });
    return res.json({ ok: true });
  } catch (error) { return assistantFailure(res, error); }
});

app.post("/api/lead", async (req, res) => {
  const language = req.body?.language === "en" ? "en" : "tr";
  const honeypot = String(req.body?.website ?? "").trim();

  if (honeypot) {
    return res.json({ ok: true });
  }
  const data = {
    name: String(req.body?.name ?? "").trim().slice(0, 120),
    company: String(req.body?.company ?? "").trim().slice(0, 160),
    phone: String(req.body?.phone ?? "").trim().slice(0, 80),
    email: String(req.body?.email ?? "").trim().slice(0, 160),
    product: String(req.body?.product ?? "").trim().slice(0, 160),
    size: String(req.body?.size ?? "").trim().slice(0, 160),
    printing: String(req.body?.printing ?? "").trim().slice(0, 40),
    quantity: String(req.body?.quantity ?? "").trim().slice(0, 120),
    message: String(req.body?.message ?? "").trim().slice(0, 1200),
  };

  if (!data.name || !data.product || !data.quantity || (!data.phone && !data.email)) {
    return res.status(400).json({
      ok: false,
      error: "INVALID_LEAD",
      message:
        language === "en"
          ? "Name, product, quantity and at least one contact detail are required."
          : "Ad, ürün, miktar ve en az bir iletişim bilgisi zorunludur.",
    });
  }

  const to = process.env.LEAD_EMAIL_TO;
  if (!to) {
    return res.status(503).json({ ok: false, error: "LEAD_EMAIL_NOT_CONFIGURED" });
  }

  const mailText = `Yeni Web Teklif Talebi
Tarih: ${new Date().toISOString()}
Dil: ${language.toUpperCase()}

Ad Soyad: ${data.name}
Firma: ${data.company || "-"}
Telefon: ${data.phone || "-"}
E-posta: ${data.email || "-"}

Ürün: ${data.product}
Ölçü / Mikron: ${data.size || "-"}
Baskı: ${data.printing || "-"}
Miktar: ${data.quantity}

Not:
${data.message || "-"}
`;

  try {
    await sendLeadEmail({
      to,
      subject: `Ser Üretim Plastik Web Teklif | ${data.company || data.name} | ${data.product}`,
      text: mailText,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("FORM_LEAD_EMAIL_FAILED");
    return res.status(500).json({ ok: false, error: "LEAD_EMAIL_FAILED" });
  }
});

// ✅ Transcript endpoint kaldırıldı (KVKK + spam + gereksiz)
app.post("/api/send-transcript", (req, res) => {
  return res.status(410).json({ error: "Bu endpoint kaldırıldı." });
});

setInterval(() => {
  const now = Date.now();

  for (const [key, bucket] of requestBuckets) {
    if (now - bucket.startedAt > RATE_WINDOW_MS * 2) requestBuckets.delete(key);
  }

}, 30 * 60 * 1000).unref();

setInterval(() => { void deliverPendingRequests().catch(() => console.error("LINA_NOTIFICATION_RETRY_PENDING")); }, 60000).unref();

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, process.env.HOST || "127.0.0.1", () => {
  console.log(`✅ Chat backend çalışıyor → http://localhost:${PORT}`);
});
