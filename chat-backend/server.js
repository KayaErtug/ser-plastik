// chat-backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";

import { aiReply } from "./ai/claude.js";
import { detectIntent } from "./intents/intentDetector.js";
import { sendLeadEmail } from "./mailer.js";

const app = express();

// ---- Config (ENV öncelikli) ----
const MAX_CHAT_MESSAGES = Number(process.env.MAX_CHAT_MESSAGES || 8);
const sessionMessageCounts = new Map();
const requestBuckets = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
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
    allowedHeaders: ["Content-Type", "X-Session-Id"],
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

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim().slice(0, 600);
  const language = req.body?.language === "en" ? "en" : "tr";
  if (!message) return res.status(400).json({ reply: language === "en" ? "Message cannot be empty." : "Mesaj boş olamaz." });
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) {
    return res.status(503).json({ error: "ASSISTANT_NOT_CONFIGURED", reply: language === "en" ? "Lina is not available yet. Please try again later." : "Lina henüz kullanıma hazır değil. Lütfen daha sonra tekrar deneyin." });
  }
  const sessionId = String(req.headers["x-session-id"] || "").trim().slice(0, 160) || crypto.randomUUID();
  const previous = sessionMessageCounts.get(sessionId);
  const count = (previous?.count || 0) + 1;
  if (count > MAX_CHAT_MESSAGES) return res.status(429).json({ limitReached: true, reply: language === "en" ? "This conversation has reached its message limit. You can use the quotation form on this page." : "Bu görüşmenin mesaj sınırına ulaşıldı. Sayfadaki teklif formunu kullanabilirsiniz." });
  sessionMessageCounts.set(sessionId, { count, lastSeen: Date.now() });
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-6).map(item => ({ role: item?.role === "assistant" ? "assistant" : "user", content: String(item?.content ?? "").slice(0, 1200) })) : [];
  try {
    const reply = await aiReply(message, detectIntent(message), history, language);
    return res.json({ reply });
  } catch {
    console.error("LINA_UPSTREAM_UNAVAILABLE");
    return res.status(502).json({ error: "ASSISTANT_UNAVAILABLE", reply: language === "en" ? "I could not generate a reply right now. Please try again shortly." : "Şu anda yanıt oluşturamadım. Lütfen kısa bir süre sonra tekrar deneyin." });
  }
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
    console.error("FORM_LEAD_EMAIL_ERROR:", error?.message || error);
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

  for (const [key, session] of sessionMessageCounts) {
    if (now - session.lastSeen > SESSION_TTL_MS) sessionMessageCounts.delete(key);
  }
}, 30 * 60 * 1000).unref();

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, process.env.HOST || "127.0.0.1", () => {
  console.log(`✅ Chat backend çalışıyor → http://localhost:${PORT}`);
});
