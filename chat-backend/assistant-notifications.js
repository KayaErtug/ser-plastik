import { promises as fs } from "node:fs";
import path from "node:path";
import { atomicJson, dataDirectory, readJson } from "./assistant-store.js";
import { sendLeadEmail } from "./mailer.js";

let running = false;
export const notificationConfigured = () => ["LEAD_EMAIL_TO", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"].every(key => Boolean(process.env[key]));
export async function deliverPendingRequests() {
  if (running || !notificationConfigured()) return;
  running = true;
  try {
    const directory = path.join(dataDirectory(), "requests");
    const files = await fs.readdir(directory).catch(error => { if (error.code === "ENOENT") return []; throw error; });
    for (const name of files.filter(item => /^LINA-[A-F0-9]{16}\.json$/.test(item))) {
      const file = path.join(directory, name);
      const request = await readJson(file, null);
      if (!request || request.notification.status === "sent") continue;
      const previous = Date.parse(request.notification.lastAttempt || "1970-01-01");
      if (Date.now() - previous < Math.min(3600000, 60000 * 2 ** Math.min(request.notification.attempts, 6))) continue;
      request.notification.attempts++;
      request.notification.lastAttempt = new Date().toISOString();
      await atomicJson(file, request);
      try {
        await sendLeadEmail({ to: process.env.LEAD_EMAIL_TO, subject: `Ser Üretim Plastik | Yeni talep ${request.id}`, text: `Müşteri tarafından onaylanan talep\nKayıt: ${request.id}\nTarih: ${request.createdAt}\n\n${Object.entries(request.draft).map(([key, value]) => `${key}: ${value || "-"}`).join("\n")}\n\nDurum: Satış ekibinin değerlendirmesini bekleyen talep; kesinleşmiş sipariş değildir.` });
        request.notification.status = "sent";
        request.notification.sentAt = new Date().toISOString();
      } catch { request.notification.status = "pending"; console.error("LINA_NOTIFICATION_PENDING"); }
      await atomicJson(file, request);
    }
  } finally { running = false; }
}
