import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const locks = new Map();
export const dataDirectory = () => path.resolve(process.env.LINA_DATA_DIR || "./data/lina");
export const validVisitor = token => typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
const ownerKey = token => crypto.createHash("sha256").update(token).digest("hex");
const now = () => new Date().toISOString();

export async function atomicJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  const handle = await fs.open(temporary, "wx", 0o600);
  try { await handle.writeFile(JSON.stringify(value)); await handle.sync(); } finally { await handle.close(); }
  try { await fs.rename(temporary, file); } catch (error) { await fs.unlink(temporary).catch(() => {}); throw error; }
}

export async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}

export async function customerTransaction(token, operation) {
  if (!validVisitor(token)) throw new Error("INVALID_VISITOR");
  const key = ownerKey(token);
  const previous = locks.get(key) || Promise.resolve();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const chain = previous.catch(() => {}).then(() => gate);
  locks.set(key, chain);
  await previous.catch(() => {});
  try {
    const file = path.join(dataDirectory(), "customers", `${key}.json`);
    const customer = await readJson(file, { version: 1, conversations: [] });
    if (customer.version !== 1 || !Array.isArray(customer.conversations)) throw new Error("INVALID_CUSTOMER_STORE");
    const result = await operation(customer, key);
    customer.conversations = customer.conversations.slice(-50);
    for (const conversation of customer.conversations) {
      conversation.messages = conversation.messages.slice(-50);
      conversation.receipts = (conversation.receipts || []).slice(-50);
    }
    customer.updatedAt = now();
    await atomicJson(file, customer);
    return result;
  } finally { release(); if (locks.get(key) === chain) locks.delete(key); }
}

export function newConversation(customer, language) {
  const conversation = { id: crypto.randomUUID(), createdAt: now(), updatedAt: now(), language, messages: [], receipts: [], summary: "", draft: {} };
  customer.conversations.push(conversation);
  customer.conversations = customer.conversations.slice(-50);
  return conversation;
}

export function getConversation(customer, id, language) {
  if (id) {
    const found = customer.conversations.find(item => item.id === id);
    if (!found) throw new Error("CONVERSATION_NOT_FOUND");
    return found;
  }
  return customer.conversations.at(-1) || newConversation(customer, language);
}

export const draftFields = ["name", "company", "phone", "email", "product", "size", "thickness", "printing", "quantity", "delivery", "notes"];
export function cleanDraft(value) {
  return Object.fromEntries(draftFields.map(field => [field, typeof value?.[field] === "string" ? value[field].trim().slice(0, field === "notes" ? 1000 : 180) : ""]));
}
export const draftRevision = draft => crypto.createHash("sha256").update(JSON.stringify(cleanDraft(draft))).digest("hex");
export const readyDraft = draft => Boolean(draft.name && draft.product && draft.quantity && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) || /^\+?[\d ()-]{8,25}$/.test(draft.phone)));

export function publicConversation(conversation) {
  return { id: conversation.id, messages: conversation.messages, draft: cleanDraft(conversation.draft), revision: draftRevision(conversation.draft), ready: readyDraft(conversation.draft), requestId: conversation.requestId || null };
}

export async function saveConfirmedRequest(customer, owner, conversation, revision) {
  if (draftRevision(conversation.draft) !== revision) throw new Error("DRAFT_CHANGED");
  const draft = cleanDraft(conversation.draft);
  if (!readyDraft(draft)) throw new Error("INCOMPLETE_DRAFT");
  const digest = crypto.createHash("sha256").update(`${owner}:${conversation.id}:${revision}`).digest("hex");
  const id = `LINA-${digest.slice(0, 16).toUpperCase()}`;
  const file = path.join(dataDirectory(), "requests", `${id}.json`);
  const existing = await readJson(file, null);
  if (!existing) await atomicJson(file, { id, createdAt: now(), owner, conversationId: conversation.id, status: "NEW_INQUIRY", draft, notification: { status: "pending", attempts: 0 } });
  if (!existing) conversation.messages.push({ role: "assistant", content: conversation.language === "en" ? `Your inquiry is saved: ${id}. This is an inquiry for sales review, not a confirmed order.` : `Talebiniz kaydedildi: ${id}. Bu, satış ekibinin değerlendireceği bir taleptir; kesinleşmiş sipariş değildir.` });
  conversation.requestId = id;
  conversation.updatedAt = now();
  return { id, status: "NEW_INQUIRY", duplicated: Boolean(existing) };
}
