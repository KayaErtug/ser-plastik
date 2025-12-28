// chat-backend/leads.js
import fs from "fs";
import path from "path";
import { sendLeadEmail, formatMailError } from "./mailer.js";

const LEADS_PATH = path.join(process.cwd(), "leads.csv");

function csvEscape(value = "") {
  const s = String(value ?? "");
  return `"${s.replace(/\r?\n/g, " ").replace(/"/g, '""').trim()}"`;
}

function extractContact(text = "") {
  const t = String(text);
  const email =
    t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone =
    t.match(/(\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";
  return { email, phone };
}

function ensureCsvHeader() {
  if (!fs.existsSync(LEADS_PATH)) {
    fs.writeFileSync(
      LEADS_PATH,
      "timestamp,intent,sessionId,ip,userMessage,aiReply,email,phone\n",
      "utf-8"
    );
  }
}

export async function captureLeadIfNeeded({
  timestamp,
  intent,
  sessionId,
  ip,
  userMessage,
  aiReply,
}) {
  // ✅ ARTIK HER MESAJI KAYDEDİYORUZ
  ensureCsvHeader();

  const { email, phone } = extractContact(userMessage);

  const row = [
    csvEscape(timestamp),
    csvEscape(intent),
    csvEscape(sessionId),
    csvEscape(ip),
    csvEscape(userMessage),
    csvEscape(aiReply),
    csvEscape(email),
    csvEscape(phone),
  ].join(",");

  fs.appendFileSync(LEADS_PATH, row + "\n", "utf-8");

  // ✅ Maili sadece kritik intent’lerde at (spam önlemek için)
  const shouldEmail = intent === "sales" || intent === "redirect_whatsapp";

  if (!shouldEmail) {
    return { captured: true, emailed: false };
  }

  const to = process.env.LEAD_EMAIL_TO;
  if (!to) {
    console.log("LEAD_EMAIL_SKIPPED: LEAD_EMAIL_TO env yok");
    return { captured: true, emailed: false };
  }

  const mailText =
`Yeni Lead ✅
Tarih: ${timestamp}
Intent: ${intent}
Session: ${sessionId}
IP: ${ip}

Kullanıcı Mesajı:
${userMessage}

AI Cevabı:
${aiReply}

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
    console.log("LEAD_EMAIL_SENT:", { to, intent, phone, email });
    return { captured: true, emailed: true };
  } catch (e) {
    console.error("LEAD_EMAIL_ERROR:", formatMailError(e));
    return { captured: true, emailed: false };
  }
}
