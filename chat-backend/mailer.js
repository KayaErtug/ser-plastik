// chat-backend/mailer.js
import nodemailer from "nodemailer";

let verifiedTransporterPromise = null;

export function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const secure = port === 465;

  const rejectUnauthorized =
    String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() !==
    "false";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    logger: false,
    debug: false,
    tls: { rejectUnauthorized },
  });
}

async function getVerifiedTransporter() {
  if (!verifiedTransporterPromise) {
    verifiedTransporterPromise = (async () => {
      const transporter = buildTransporter();
      await transporter.verify();
      return transporter;
    })().catch((error) => {
      verifiedTransporterPromise = null;
      throw error;
    });
  }

  return verifiedTransporterPromise;
}

function sanitizeHeaderValue(value, fallback = "") {
  return String(value || fallback)
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 200);
}

export async function sendLeadEmail({ to, subject, text }) {
  const safeTo = sanitizeHeaderValue(to);
  if (!safeTo) {
    throw new Error("MAIL_RECIPIENT_NOT_CONFIGURED");
  }

  const transporter = await getVerifiedTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to: safeTo,
    subject: sanitizeHeaderValue(subject, "Ser Plastik Lead"),
    text: String(text || "").slice(0, 20000),
  });
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
