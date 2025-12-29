// chat-backend/ai/openai.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";

let client = null;

function getClient() {
  if (client) return client;

  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  client = new OpenAI({ apiKey: key });
  return client;
}

function loadSystemPrompt({ intent } = {}) {
  // Prompt'u dosyadan okumak: düzenleme kolaylığı
  const promptPath =
    process.env.AI_CONTEXT_PATH || path.join(process.cwd(), "ai_context.md");

  let base = "";
  try {
    base = fs.readFileSync(promptPath, "utf-8");
  } catch {
    base = "";
  }

  const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "+90 533 666 7399";
  const FACTORY_PHONE = process.env.FACTORY_PHONE || "+90 258 371 30 50";

  // Dosya içeriğini “system” prompt'a çevirecek kısa bir çerçeve
  const wrapper = `
Sen Ser Plastik'in resmi AI satış ve müşteri temsilcisisin.

INTENT: ${intent}

SABİT İLETİŞİM:
- WhatsApp: ${WHATSAPP_NUMBER}
- Fabrika/İşyeri: ${FACTORY_PHONE}

AŞAĞIDAKİ TALİMATLAR BAĞLAYICIDIR:
${base}
`.trim();

  return wrapper;
}

export async function aiReply(message, intent) {
  const openai = getClient();
  if (!openai) throw new Error("AI_DISABLED");

  const systemPrompt = loadSystemPrompt({ intent });

  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: String(message) },
    ],
  });

  return (
    res.choices?.[0]?.message?.content?.trim() ||
    "Size nasıl yardımcı olabilirim?"
  );
}
