import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Volume2, VolumeX, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { postJson } from "../api";
import { useVoiceInput } from "../useVoiceInput";

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
          ? "Hello, I’m Lina. I can help with Ser Üretim Plastik products, quotations and order requests."
          : "Merhaba, ben Lina. Ser Üretim Plastik ürünleri, teklif ve sipariş talepleri konusunda yardımcı olabilirim.",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [voice, setVoice] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const generation = useRef(0);
  const active = useRef(false);
  const voiceEnabled = useRef(false);
  const microphone = useVoiceInput(language, text => { setInputText(text); setVoice(true); voiceEnabled.current = true; });
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "tr" ? "tr-TR" : "en-GB";
    const match = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith(language));
    if (match) utterance.voice = match;
    utterance.onerror = () => setVoiceNotice(language === "tr" ? "Ses oynatılamadı; yazılı yanıtı okuyabilirsiniz." : "Audio unavailable; please read the written reply.");
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    generation.current++;
    window.speechSynthesis?.cancel();
    setLoading(false);
    setVoiceNotice("");
    return () => { generation.current++; window.speechSynthesis?.cancel(); };
  }, [language]);
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `lina-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const MAX_USER_MESSAGES = 8;

  const ui = {
    tr: {
      hint: "Lina’ya sorun",
      subtitle: "Ser Üretim Plastik AI Satış Asistanı",
      typing: "Lina yazıyor...",
      placeholder: "Mesajınızı yazın...",
      send: "Gönder",
      close: "Kapat",
      privacy: "Mesajlarınız yanıt üretmek için Claude hizmetine iletilir. Hassas bilgi paylaşmayın.",
      fallback: "Şu anda yanıt oluşturulamıyor. Lütfen kısa bir süre sonra tekrar deneyin.",
      noReply: "Yanıt alınamadı.",
      limit: "Bu görüşmenin mesaj sınırına ulaşıldı. Talebiniz için sayfadaki teklif formunu kullanabilirsiniz.",
    },
    en: {
      hint: "Ask Lina",
      subtitle: "Ser Üretim Plastik AI Sales Assistant",
      typing: "Lina is typing...",
      placeholder: "Type your message...",
      send: "Send",
      close: "Close",
      privacy: "Your messages are sent to Claude to generate replies. Please avoid sharing sensitive information.",
      fallback: "Unable to generate a reply right now. Please try again shortly.",
      noReply: "No response received.",
      limit: "This conversation has reached its message limit. You can use the quotation form on this page.",
    },
  }[language];

  const quickReplies = useMemo(
    () =>
      language === "en"
        ? ["What products do you offer?", "I need a quotation", "Tell me about production", "Contact details"]
        : ["Ürünleriniz neler?", "Fiyat / Teklif almak istiyorum", "Üretim hakkında bilgi", "İletişim bilgileri"],
    [language]
  );

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
              ? "Hello, I’m Lina. I can help with Ser Üretim Plastik products, quotations and order requests."
              : "Merhaba, ben Lina. Ser Üretim Plastik ürünleri, teklif ve sipariş talepleri konusunda yardımcı olabilirim.",
          isBot: true,
        },
      ];
    });
  }, [language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    microphone.stop();

    if (messages.filter((message) => !message.isBot).length >= MAX_USER_MESSAGES) {
      setMessages((prev) => [...prev, { text: ui.limit, isBot: true }]);
      return;
    }

    const current = generation.current;
    const history = messages.slice(-6).map((message) => ({
      role: message.isBot ? "assistant" : "user",
      content: message.text,
    }));

    setMessages((prev) => [...prev, { text, isBot: false }]);
    setInputText("");
    setLoading(true);

    try {
      const response = await postJson(
        "/api/chat",
        { message: text, history, language },
        { headers: { "X-Session-Id": sessionIdRef.current } }
      );

      const data = await response.json().catch(() => null);
      if (current !== generation.current) return;

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { text: data?.reply ?? ui.fallback, isBot: true },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { text: data?.reply ?? ui.noReply, isBot: true },
      ]);
      if (voiceEnabled.current && active.current && typeof data?.reply === "string") speak(data.reply);
    } catch {
      if (current !== generation.current) return;
      setMessages((prev) => [...prev, { text: ui.fallback, isBot: true }]);
    } finally {
      if (current === generation.current) setLoading(false);
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
          id="lina-chat-trigger"
          onClick={() => { active.current = true; setIsOpen(true); }}
          className="chat-fab relative rounded-full bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 text-white shadow-2xl transition hover:scale-110"
          aria-label={`Lina - ${ui.subtitle}`}
        >
          <span className="absolute -inset-1 rounded-full bg-[#2E75D4]/30 animate-ping" />
          <span className="relative"><MessageCircle size={30} /></span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label={language === "tr" ? "Lina ambalaj asistanı" : "Lina packaging assistant"} className="lina-panel fixed bottom-20 right-3 z-50 flex h-[min(610px,calc(100svh-6rem))] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.15] bg-white shadow-[0_30px_90px_rgba(3,17,38,.35)] sm:bottom-6 sm:right-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#06172f] to-[#0D47A1] p-4 text-white">
        <div>
          <h3 className="text-lg font-black">Lina</h3>
          <p className="text-xs text-white/70">{ui.subtitle}</p>
        </div>
        <button onClick={() => { active.current = false; microphone.stop(); setIsOpen(false); window.speechSynthesis?.cancel(); }} className="rounded-full p-2 transition hover:bg-white/10" aria-label={ui.close}>
          <X size={19} />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-xs">
        <span className="text-slate-400">AI · TR / EN</span>
        <button aria-pressed={voice} disabled={!("speechSynthesis" in window)} onClick={() => { setVoice(!voice); voiceEnabled.current = !voice; if (voice) window.speechSynthesis?.cancel(); }} className="flex items-center gap-2 rounded-full px-2 py-1 text-blue-800 disabled:opacity-40">{voice ? <Volume2 size={15} /> : <VolumeX size={15} />}{language === "tr" ? (voice ? "Sesli yanıt açık" : "Sesli yanıtı aç") : (voice ? "Voice replies on" : "Enable voice replies")}</button>
      </div>
      <div role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto bg-[#f4f7fb] p-4">
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
              {message.isBot && "speechSynthesis" in window && <button onClick={() => speak(message.text)} aria-label={language === "tr" ? "Yanıtı sesli dinle" : "Listen to reply"} className="mt-2 block rounded p-1 text-slate-400 hover:text-blue-700"><Volume2 size={14} /></button>}
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
        {voiceNotice && <p role="status" className="mb-2 text-xs text-amber-800">{voiceNotice}</p>}
        {microphone.error && <p role="status" className="mb-2 text-xs text-amber-800">{microphone.error}</p>}
        {microphone.listening && <p role="status" className="mb-2 text-xs text-blue-800">{language === "tr" ? "Dinliyorum… Bitince metni kontrol edip Gönder’e basın." : "Listening… Review the text, then press Send."}</p>}
        {voice && <button onClick={() => window.speechSynthesis?.cancel()} className="mb-2 text-xs text-blue-800">{language === "tr" ? "Sesi durdur" : "Stop audio"}</button>}


        <div className="flex gap-2">
          <input
            value={inputText}
            maxLength={600}
            aria-label={language === "tr" ? "Lina’ya mesajınız" : "Your message to Lina"}
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
          {microphone.supported && <button onClick={microphone.start} disabled={loading} aria-pressed={microphone.listening} aria-label={language === "tr" ? (microphone.listening ? "Kaydı durdur" : "Sesli mesaj yazdır") : (microphone.listening ? "Stop recording" : "Dictate a message")} className={`rounded-xl px-3 ${microphone.listening ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}><Mic size={18} /></button>}
          <button
            onClick={() => sendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            aria-label={ui.send}
            className="rounded-xl bg-[#0D47A1] px-4 text-white transition hover:bg-[#082f73] disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-slate-400">{ui.privacy}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-400">{language === "tr" ? "Sesli yanıtlar cihazınızın Türkçe/İngilizce seslerini kullanır; ses kalitesi tarayıcıya göre değişir." : "Voice replies use your device’s Turkish/English voices; voice quality varies by browser."}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-400">{language === "tr" ? "Mikrofon yalnızca siz başlattığınızda açılır; sesin metne çevrilmesi tarayıcınızın ses hizmetini kullanabilir. Desteklenmeyen tarayıcılarda yazılı sohbet kullanılabilir." : "The microphone starts only when you choose; transcription may use your browser’s speech service. Text chat remains available on unsupported browsers."}</p>
      </div>
    </aside>
  );
}
