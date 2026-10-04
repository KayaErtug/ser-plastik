// chat-backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";

import { aiReply } from "./ai/openai.js";
import { detectIntent } from "./intents/intentDetector.js";
import { captureLeadIfNeeded } from "./leads.js";
import { sendLeadEmail } from "./mailer.js";

const app = express();

// ---- Config (ENV öncelikli) ----
const WHATSAPP_NUMBER = "+90 533 666 73 81";
const FACTORY_PHONE = process.env.FACTORY_PHONE || "+90 258 371 30 50";
const MAX_CHAT_MESSAGES = Number(process.env.MAX_CHAT_MESSAGES || 8);
const sessionMessageCounts = new Map();
const requestBuckets = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 25;

app.set("trust proxy", 1);

// CORS: sadece izinli origin'ler
const allowedOrigins = String(
  process.env.CORS_ORIGINS ||
    "https://ser-plastik.com,https://www.ser-plastik.com"
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
    return res.status(429).json({
      error: "RATE_LIMIT",
      reply: "Çok fazla istek gönderildi. Lütfen kısa bir süre sonra tekrar deneyin.",
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

  const intent = detectIntent(message);

  const sessionId =
    String(req.headers["x-session-id"] || "").trim() ||
    (crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex"));

  const count = (sessionMessageCounts.get(sessionId) || 0) + 1;
  sessionMessageCounts.set(sessionId, count);

  if (count > MAX_CHAT_MESSAGES) {
    return res.json({
      reply:
        language === "en"
          ? `Mimi is designed for short conversations. For sales follow-up, please continue on WhatsApp: ${WHATSAPP_NUMBER}`
          : `Mimi kısa görüşmeler için tasarlanmıştır. Talebinizi satış ekibimize iletmek için WhatsApp: ${WHATSAPP_NUMBER}`,
      limitReached: true,
    });
  }

  const history = Array.isArray(req.body?.history)
    ? req.body.history.slice(-6).map((item) => ({
        role: item?.role === "assistant" ? "assistant" : "user",
        content: String(item?.content ?? "").slice(0, 1200),
      }))
    : [];

  try {
    // İletişim / WhatsApp intentlerinde deterministik cevap (AI'ye bırakmıyoruz)
    if (intent === "website") {
      return res.json({
        reply:
          language === "en"
            ? "ser-plastik.com is Ser Üretim Plastik’s official corporate website. The company has 20 years of plastic packaging production experience and serves domestic and international customers with courier bags, industrial packaging, plastic bags, garbage bags, transparent packaging and custom solutions. You can review products, request a quotation, contact sales on WhatsApp, or ask Mimi for help."
            : "ser-plastik.com, Ser Üretim Plastik’in resmi kurumsal web sitesidir. Firma plastik ambalaj sektöründe 20 yıllık üretim deneyimine sahiptir; kargo poşetleri, endüstriyel ambalaj, naylon torbalar, çöp torbaları, jelatin ambalaj ve özel çözümlerle yurt içi ve yurt dışındaki müşterilerine hizmet verir. Siteden ürünleri inceleyebilir, teklif talebi oluşturabilir, WhatsApp üzerinden satış ekibine ulaşabilir veya Mimi’den destek alabilirsiniz.",
      });
    }

    if (intent === "contact") {
      const conversationText = [
        ...history.filter((item) => item.role === "user").map((item) => item.content),
        message,
      ].join("\n");

      await captureLeadIfNeeded({
        timestamp: new Date().toISOString(),
        intent,
        sessionId,
        userMessage: conversationText,
      });

      return res.json({
        reply:
          language === "en"
            ? `Contact details:\n• WhatsApp: ${WHATSAPP_NUMBER}\n• Factory/Office: ${FACTORY_PHONE}`
            : `İletişim bilgilerimiz:\n• WhatsApp: ${WHATSAPP_NUMBER}\n• Fabrika/İşyeri: ${FACTORY_PHONE}`,
      });
    }

    if (intent === "whatsapp") {
      // Lead: WhatsApp intent -> 1 mail
      await captureLeadIfNeeded({
        timestamp: new Date().toISOString(),
        intent,
        sessionId,
        userMessage: [
          ...history.filter((item) => item.role === "user").map((item) => item.content),
          message,
        ].join("\n"),
      });

      return res.json({
        reply:
          language === "en"
            ? `WhatsApp: ${WHATSAPP_NUMBER}\nYou can send your quotation request directly here.`
            : `WhatsApp hattımız: ${WHATSAPP_NUMBER}\nHızlı teklif için buradan yazabilirsiniz.`,
      });
    }

    // Normal akış: AI yanıtı
    const reply = await aiReply(message, intent, history);

    // Lead: sadece sales / whatsapp intentlerinde (whatsapp yukarıda)
    await captureLeadIfNeeded({
      timestamp: new Date().toISOString(),
      intent,
      sessionId,
      userMessage: [...history.filter((item) => item.role === "user").map((item) => item.content), message].join("\n"),
      aiReply: reply,
    });

    return res.json({ reply });
  } catch (err) {
    console.error("CHAT_ERROR:", err?.message || err);

    const fallback =
      language === "en"
        ? `Connection is temporarily unavailable. For quick contact, WhatsApp: ${WHATSAPP_NUMBER}`
        : `Şu anda bağlantı sağlanamadı. Hızlı iletişim için WhatsApp: ${WHATSAPP_NUMBER}`;

    // Hata anında bile: intent sales/whatsapp ise lead mail deneyelim
    try {
      await captureLeadIfNeeded({
        timestamp: new Date().toISOString(),
        intent: intent || "error",
        sessionId,
        userMessage: message,
        aiReply: fallback,
      });
    } catch (e) {
      console.error("LEAD_CAPTURE_ERROR:", e?.message || e);
    }

    return res.json({ reply: fallback });
  }
});

app.post("/api/lead", async (req, res) => {
  const language = req.body?.language === "en" ? "en" : "tr";
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
      subject: `Ser Plastik Web Teklif | ${data.company || data.name} | ${data.product}`,
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

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`✅ Chat backend çalışıyor → http://localhost:${PORT}`);
});
