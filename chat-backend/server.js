// chat-backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";

import { aiReply } from "./ai/openai.js";
import { detectIntent } from "./intents/intentDetector.js";
import { captureLeadIfNeeded } from "./leads.js";

const app = express();

// CORS: prod’da domain kısıtlamak istersen burayı daraltırsın
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Basit sağlık kontrolü
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "ser-plastik-chat-backend" });
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) {
    return res.status(400).json({ reply: "Mesaj boş olamaz." });
  }

  const intent = detectIntent(message);

  const sessionId =
    String(req.headers["x-session-id"] || "").trim() ||
    (crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex"));

  const ip =
    String(req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim() ||
    req.socket?.remoteAddress ||
    "";

  try {
    // İstersen redirect_whatsapp’ta AI’ye gitmeden direkt cevap dön
    if (intent === "redirect_whatsapp") {
      const reply =
        "WhatsApp üzerinden hızlıca yardımcı olalım: +90 258 371 30 50";

      // Lead yakala (CSV + mail)
      const leadResult = await captureLeadIfNeeded({
        timestamp: new Date().toISOString(),
        intent,
        sessionId,
        ip,
        userMessage: message,
        aiReply: reply,
      });

      console.log("LEAD_CAPTURE:", leadResult);

      return res.json({ reply });
    }

    const reply = await aiReply(message, intent);

    // Lead yakala (CSV + mail)
    const leadResult = await captureLeadIfNeeded({
      timestamp: new Date().toISOString(),
      intent,
      sessionId,
      ip,
      userMessage: message,
      aiReply: reply,
    });

    console.log("LEAD_CAPTURE:", leadResult);

    return res.json({ reply });
  } catch (err) {
    console.error("CHAT_ERROR:", err?.message || err);

    const fallback =
      "Şu anda bağlantı sağlanamadı. WhatsApp üzerinden bizimle iletişime geçebilirsiniz: +90 258 371 30 50";

    // Hata olsa bile lead dene (CSV + mail)
    try {
      const leadResult = await captureLeadIfNeeded({
        timestamp: new Date().toISOString(),
        intent: intent || "error",
        sessionId,
        ip,
        userMessage: message,
        aiReply: fallback,
      });
      console.log("LEAD_CAPTURE:", leadResult);
    } catch (e) {
      console.error("LEAD_CAPTURE_ERROR:", e?.message || e);
    }

    return res.json({ reply: fallback });
  }
});

app.post("/api/send-transcript", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Mesaj listesi geçersiz." });
  }

  try {
    // Mesajları formatla
    const transcript = messages
      .map((m) => `[${m.isBot ? "AI" : "User"}]: ${m.text}`)
      .join("\n\n");

    const subject = "Ser-Plastik Chat Box Raporu";
    const text = `Web sitesinden yeni bir sohbet kaydı gönderildi:\n\n${transcript}`;

    // Admin mailine gönder (SMTP_USER veya MAIL_FROM)
    // sendLeadEmail fonksiyonunu tekrar kullanabiliriz, "to" parametresi admin olacak.
    // Ancak sendLeadEmail varsayılan olarak kime atıyor?
    // mailer.js'e baktığımızda "to" parametresini alıyor.
    // Admin mailini .env'den alabiliriz veya direkt SMTP_USER'a atabiliriz.
    const adminEmail = "umaykutay@gmail.com, serplastik@outlook.com";

    await import("./mailer.js").then(({ sendLeadEmail }) =>
      sendLeadEmail({
        to: adminEmail,
        subject,
        text,
      })
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("TRANSCRIPT_ERROR:", err);
    return res.status(500).json({ error: "Mail gönderilemedi." });
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`✅ Chat backend çalışıyor → http://localhost:${PORT}`);
});
