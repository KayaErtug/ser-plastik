// chat-backend/ai/openai.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

let client = null;

function getClient() {
  if (client) return client;

  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  client = new OpenAI({ apiKey: key });
  return client;
}

function readContextFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function loadSystemPrompt({ intent, language } = {}) {
  const promptPath =
    process.env.AI_CONTEXT_PATH || path.join(currentDir, "ai_context.md");
  const companyContextPath =
    process.env.COMPANY_CONTEXT_PATH || path.join(currentDir, "company_context.md");

  const boundaries = readContextFile(promptPath);
  const companyContext = readContextFile(companyContextPath);

  const WHATSAPP_NUMBER = "+90 533 666 73 81";
  const FACTORY_PHONE = process.env.FACTORY_PHONE || "+90 258 371 30 50";

  // Dosya içeriğini “system” prompt'a çevirecek kısa bir çerçeve
  const wrapper = `
Sen Mimi'sin; Ser Plastik'in resmi AI satış ve müşteri temsilcisisin.

INTENT: ${intent}
SITE LANGUAGE: ${language === "en" ? "English" : "Turkish"}

SABİT İLETİŞİM:
- WhatsApp: ${WHATSAPP_NUMBER}
- Fabrika/İşyeri: ${FACTORY_PHONE}

KONUŞMA SINIRLARI VE DAVRANIŞ KURALLARI:
${boundaries}

ONAYLI ŞİRKET BİLGİSİ:
${companyContext}
`.trim();

  return wrapper;
}

export async function aiReply(message, intent, history = [], language = "tr") {
  const openai = getClient();
  if (!openai) throw new Error("AI_DISABLED");

  const systemPrompt = loadSystemPrompt({ intent, language });

  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 220,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.slice(-6),
      { role: "user", content: String(message) },
    ],
  });

  return (
    res.choices?.[0]?.message?.content?.trim() ||
    "Size nasıl yardımcı olabilirim?"
  );
}
