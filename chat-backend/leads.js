import { sendLeadEmail, formatMailError } from "./mailer.js";

const emailedSessions = new Map();
const EMAILED_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function wasRecentlyEmailed(sessionId) {
  const sentAt = emailedSessions.get(sessionId);
  if (!sentAt) return false;

  if (Date.now() - sentAt > EMAILED_SESSION_TTL_MS) {
    emailedSessions.delete(sessionId);
    return false;
  }

  return true;
}

function pruneEmailedSessions() {
  if (emailedSessions.size < 2000) return;

  const now = Date.now();
  for (const [sessionId, sentAt] of emailedSessions) {
    if (now - sentAt > EMAILED_SESSION_TTL_MS) {
      emailedSessions.delete(sessionId);
    }
  }
}

function extractContact(text = "") {
  const value = String(text);
  const email = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = value.match(/(\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";
  return { email, phone };
}

function hasSalesSignal(text = "") {
  const value = String(text).toLowerCase();
  return [
    "fiyat",
    "teklif",
    "sipariş",
    "kaç para",
    "termin",
    "üretim süresi",
    "minimum",
    "moq",
    "adet",
    "kg",
    "kilo",
    "ton",
    "price",
    "quote",
    "quotation",
    "offer",
    "order",
    "purchase",
    "lead time",
    "delivery time",
    "quantity",
    "pcs",
    "pieces",
  ].some((term) => value.includes(term));
}

function isQualifiedLead(intent, text) {
  return intent === "sales" || intent === "whatsapp" || hasSalesSignal(text);
}

export async function captureLeadIfNeeded({
  timestamp,
  intent,
  sessionId,
  userMessage,
  aiReply = "",
}) {
  pruneEmailedSessions();
  if (wasRecentlyEmailed(sessionId)) return { captured: true, emailed: false };

  const { email, phone } = extractContact(userMessage);
  if (!email && !phone) {
    return {
      captured: isQualifiedLead(intent, userMessage),
      emailed: false,
      waitingForContact: isQualifiedLead(intent, userMessage),
    };
  }

  if (!isQualifiedLead(intent, userMessage)) {
    return { captured: false, emailed: false };
  }

  const to = process.env.LEAD_EMAIL_TO;
  if (!to) {
    console.log("LEAD_EMAIL_SKIPPED: LEAD_EMAIL_TO env yok");
    return { captured: true, emailed: false };
  }

  const mailText = `Yeni Ser Plastik Lead
Tarih: ${timestamp}
Intent: ${intent}
Session: ${sessionId}

Ziyaretçi Konuşma Özeti / Mesajları:
${userMessage}

Mimi Son Cevabı:
${aiReply || "-"}

Tespit Edilen İletişim:
E-posta: ${email || "-"}
Telefon: ${phone || "-"}
`;

  try {
    await sendLeadEmail({
      to,
      subject: `Ser Plastik Lead | ${phone || email}`,
      text: mailText,
    });

    emailedSessions.set(sessionId, Date.now());
    return { captured: true, emailed: true };
  } catch (error) {
    console.error("LEAD_EMAIL_ERROR:", formatMailError(error));
    return { captured: true, emailed: false };
  }
}
