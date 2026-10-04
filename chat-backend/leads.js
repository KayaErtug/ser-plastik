import { sendLeadEmail, formatMailError } from "./mailer.js";

const emailedSessions = new Set();

function extractContact(text = "") {
  const value = String(text);
  const email = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = value.match(/(\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";
  return { email, phone };
}

function isLeadIntent(intent) {
  return intent === "sales" || intent === "whatsapp";
}

export async function captureLeadIfNeeded({
  timestamp,
  intent,
  sessionId,
  userMessage,
  aiReply = "",
}) {
  if (!isLeadIntent(intent)) return { captured: false, emailed: false };
  if (emailedSessions.has(sessionId)) return { captured: true, emailed: false };

  const { email, phone } = extractContact(userMessage);
  if (!email && !phone) {
    return { captured: true, emailed: false, waitingForContact: true };
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

    emailedSessions.add(sessionId);
    return { captured: true, emailed: true };
  } catch (error) {
    console.error("LEAD_EMAIL_ERROR:", formatMailError(error));
    return { captured: true, emailed: false };
  }
}
