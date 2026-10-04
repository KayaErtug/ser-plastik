import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface Message {
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text:
        language === "en"
          ? "Hello, I’m Mimi. I can help with Ser Plastik products, quotations and order requests."
          : "Merhaba, ben Mimi. Ser Plastik ürünleri, teklif ve sipariş talepleri konusunda yardımcı olabilirim.",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `mimi-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const MAX_USER_MESSAGES = 8;

  const ui = {
    tr: {
      hint: "Mimi'ye sorun",
      subtitle: "Ser Plastik AI Satış Asistanı",
      typing: "Mimi yazıyor...",
      whatsapp: "WhatsApp ile İletişim",
      placeholder: "Mesajınızı yazın...",
      send: "Gönder",
      close: "Kapat",
      fallback: "Şu anda bağlantı sağlanamadı. WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
      noReply: "Yanıt alınamadı.",
      limit: "Mimi kısa görüşmeler için tasarlanmıştır. Talebinizi WhatsApp üzerinden satış ekibimize iletebilirsiniz.",
    },
    en: {
      hint: "Ask Mimi",
      subtitle: "Ser Plastik AI Sales Assistant",
      typing: "Mimi is typing...",
      whatsapp: "Contact on WhatsApp",
      placeholder: "Type your message...",
      send: "Send",
      close: "Close",
      fallback: "Connection is temporarily unavailable. Please contact us on WhatsApp.",
      noReply: "No response received.",
      limit: "Mimi is designed for short conversations. You can continue your request with our sales team on WhatsApp.",
    },
  }[language];

  const quickReplies = useMemo(
    () =>
      language === "en"
        ? ["What products do you offer?", "I need a quotation", "Tell me about production", "Contact details"]
        : ["Ürünleriniz neler?", "Fiyat / Teklif almak istiyorum", "Üretim hakkında bilgi", "İletişim bilgileri"],
    [language]
  );

  const API_URL =
    (import.meta.env.VITE_API_BASE_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "";

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1) return current;
      return [
        {
          text:
            language === "en"
              ? "Hello, I’m Mimi. I can help with Ser Plastik products, quotations and order requests."
              : "Merhaba, ben Mimi. Ser Plastik ürünleri, teklif ve sipariş talepleri konusunda yardımcı olabilirim.",
          isBot: true,
        },
      ];
    });
  }, [language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    if (messages.filter((message) => !message.isBot).length >= MAX_USER_MESSAGES) {
      setMessages((prev) => [...prev, { text: ui.limit, isBot: true }]);
      return;
    }

    const history = messages.slice(-6).map((message) => ({
      role: message.isBot ? "assistant" : "user",
      content: message.text,
    }));

    setMessages((prev) => [...prev, { text, isBot: false }]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionIdRef.current,
        },
        body: JSON.stringify({ message: text, history, language }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: data?.reply ?? ui.noReply, isBot: true },
      ]);
    } catch {
      setMessages((prev) => [...prev, { text: ui.fallback, isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
        {showHint && (
          <div className="absolute -top-14 right-0">
            <div className="relative whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xl">
              {ui.hint}
              <span className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="chat-fab relative rounded-full bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 text-white shadow-2xl transition hover:scale-110"
          aria-label={`Mimi - ${ui.subtitle}`}
        >
          <span className="absolute -inset-1 rounded-full bg-[#2E75D4]/30 animate-ping" />
          <span className="relative"><MessageCircle size={30} /></span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-3 z-50 flex h-[min(610px,calc(100svh-6rem))] sm:bottom-6 sm:right-6 w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.6rem] border border-white/15 bg-white shadow-[0_30px_90px_rgba(3,17,38,.35)] sm:bottom-6 sm:right-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#06172f] to-[#0D47A1] p-4 text-white">
        <div>
          <h3 className="text-lg font-black">Mimi</h3>
          <p className="text-xs text-white/70">{ui.subtitle}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="rounded-full p-2 transition hover:bg-white/10" aria-label={ui.close}>
          <X size={19} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4f7fb] p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[82%] whitespace-pre-line rounded-2xl p-3 text-sm leading-6 ${
                message.isBot
                  ? "bg-white text-slate-700 shadow-sm"
                  : "bg-[#0D47A1] text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-[#0D47A1] transition hover:border-blue-200 hover:bg-blue-50"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="text-xs text-slate-400">{ui.typing}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-3">
        <button
          onClick={() => window.open("https://wa.me/905336667381", "_blank")}
          className="mb-2 flex w-full items-center justify-center rounded-xl bg-[#25D366] py-2.5 font-bold text-white transition hover:bg-[#20BA5A]"
        >
          <Phone className="mr-2" size={17} />
          {ui.whatsapp}
        </button>

        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage(inputText);
              }
            }}
            placeholder={ui.placeholder}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0D47A1]"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            aria-label={ui.send}
            className="rounded-xl bg-[#0D47A1] px-4 text-white transition hover:bg-[#082f73] disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
