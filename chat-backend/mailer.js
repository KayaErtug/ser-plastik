// chat-backend/mailer.js
import nodemailer from "nodemailer";

export function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Debug
    logger: true,
    debug: true,
    tls: {
      // Kurumsal mail sistemlerinde bazen sertifika zinciri sorun çıkarır.
      // Eğer "self signed certificate" görürsen bunu false yapacağız.
      rejectUnauthorized: false,
    },
  });
}

export async function sendLeadEmail({ to, subject, text }) {
  const transporter = buildTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  // SMTP erişimini test et
  await transporter.verify();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });

  return info;
}

export function formatMailError(e) {
  return {
    message: e?.message,
    code: e?.code,
    response: e?.response,
    responseCode: e?.responseCode,
    command: e?.command,
  };
}
