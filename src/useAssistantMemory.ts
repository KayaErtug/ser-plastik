import { useCallback, useEffect, useRef, useState } from "react";
import { postJson } from "./api";

export type InquiryDraft = Record<"name" | "company" | "phone" | "email" | "product" | "size" | "thickness" | "printing" | "quantity" | "delivery" | "notes", string>;
type Conversation = { id: string; messages: { role: "user" | "assistant"; content: string }[]; draft: InquiryDraft; revision: string; ready: boolean; requestId: string | null };
type ConversationList = { id: string; createdAt: string; title: string }[];
type ChatResponse = { reply: string; conversation?: Conversation; memorySaved?: boolean };

function visitorToken() {
  try {
    const stored = localStorage.getItem("lina-visitor-v1");
    if (stored && /^[a-f0-9]{64}$/.test(stored)) return stored;
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("lina-visitor-v1", token);
    return token;
  } catch { return ""; }
}

export function useAssistantMemory(open: boolean, language: "tr" | "en") {
  const [token] = useState(visitorToken);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<ConversationList>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const generation = useRef(0);
  const headers = token ? { "X-Visitor-Token": token } : undefined;
  const load = useCallback(async (fresh = false, conversationId?: string) => {
    if (!token) return;
    const current = ++generation.current;
    setBusy(true); setError(""); setNotification("");
    try {
      const response = await postJson("/api/assistant/session", { fresh, conversationId, language }, { headers: { "X-Visitor-Token": token } });
      if (!response.ok) throw new Error("MEMORY_UNAVAILABLE");
      const data = await response.json();
      if (current !== generation.current) return;
      setConversation(data.conversation); setConversations(data.conversations);
    } catch { if (current === generation.current) setError(language === "tr" ? "Görüşme hafızasına erişilemedi. Tekrar deneyin." : "Conversation memory is unavailable. Please retry."); }
    finally { if (current === generation.current) setBusy(false); }
  }, [token, language]);
  useEffect(() => { if (open) void load(); return () => { generation.current++; }; }, [open, load]);

  const send = async (message: string, history: { role: string; content: string }[]): Promise<ChatResponse> => {
    if (token && (!conversation || error)) throw new Error("MEMORY_UNAVAILABLE");
    const current = generation.current;
    const requestId = crypto.randomUUID();
    const response = await postJson("/api/chat", { message, history: token ? undefined : history.slice(-50), language, conversationId: conversation?.id, requestId }, { headers });
    const data = await response.json();
    if (!response.ok || typeof data.reply !== "string") throw new Error("CHAT_UNAVAILABLE");
    if (current !== generation.current) throw new Error("STALE_CONVERSATION");
    if (data.conversation) {
      setConversation(data.conversation);
      setConversations(previous => previous.map(item => item.id === data.conversation.id ? { ...item, title: item.title || message.slice(0, 90) } : item));
    }
    return data;
  };
  const confirmRequest = async () => {
    if (!conversation) return;
    setBusy(true); setError("");
    try {
      const response = await postJson("/api/assistant/request", { conversationId: conversation.id, revision: conversation.revision, confirmed: true, language }, { headers });
      if (!response.ok) throw new Error("REQUEST_NOT_SAVED");
      const data = await response.json();
      await load(false, conversation.id);
      setNotification(data.notification === "queued" ? (language === "tr" ? "Yönetici bildirimi gönderim kuyruğunda." : "Manager notification is queued.") : (language === "tr" ? "Talep kaydedildi. E-posta bağlantısı kurulana kadar bildirim bekleyecek." : "Inquiry saved. Notification awaits email setup."));
    } catch { setError(language === "tr" ? "Talep kaydedilemedi. Güncel özeti kontrol edip tekrar deneyin." : "Could not save the inquiry. Review the latest details and retry."); }
    finally { setBusy(false); }
  };
  const forget = async () => {
    if (!window.confirm(language === "tr" ? "Sohbet geçmişiniz silinsin mi? Onaylayarak kaydettiğiniz talepler korunur." : "Delete your conversation history? Previously submitted inquiries are retained.")) return;
    setBusy(true);
    try {
      const response = await postJson("/api/assistant/forget", {}, { headers });
      if (!response.ok) throw new Error("FORGET_FAILED");
      await load(true);
    } catch { setError(language === "tr" ? "Geçmiş silinemedi." : "Could not delete history."); }
    finally { setBusy(false); }
  };
  return { available: Boolean(token), conversation, conversations, busy, error, notification, load, send, confirmRequest, forget };
}
