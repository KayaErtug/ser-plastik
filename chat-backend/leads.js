// chat-backend/leads.js
import { sendLeadEmail, formatMailError } from "./mailer.js";

function extractContact(text = "") {
  const t = String(text);

  const email =
    t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";

  const phone = t.match(/(\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";

  return { email, phone };
}

function isLeadIntent(intent) {
  // Sadece satış sinyali + WhatsApp intentinde lead maili
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

  const to = process.env.LEAD_EMAIL_TO;
  if (!to) {
    console.log("LEAD_EMAIL_SKIPPED: LEAD_EMAIL_TO env yok");
    return { captured: true, emailed: false };
  }

  const { email, phone } = extractContact(userMessage);

  const mailText = `Yeni Lead ✅
Tarih: ${timestamp}
Intent: ${intent}
Session: ${sessionId}

Kullanıcı Mesajı:
${userMessage}

AI Cevabı:
${aiReply || "-"}

Tespit edilen:
E-posta: ${email || "-"}
Telefon: ${phone || "-"}
`;

  try {
    await sendLeadEmail({
      to,
      subject: `Ser Plastik Lead: ${intent} | ${phone || email || "iletişim yok"}`,
      text: mailText,
    });

    return { captured: true, emailed: true };
  } catch (e) {
    console.error("LEAD_EMAIL_ERROR:", formatMailError(e));
    return { captured: true, emailed: false };
  }
}
