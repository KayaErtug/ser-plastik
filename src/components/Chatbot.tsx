import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Volume2, VolumeX, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useAssistantMemory } from "../useAssistantMemory";
import { useVoiceInput } from "../useVoiceInput";

interface Message {
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const memory = useAssistantMemory(isOpen, language);
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const ui = {
    tr: {
      hint: "Lina’ya sorun",
      subtitle: "Ser Üretim Plastik AI Satış Asistanı",
      typing: "Lina yazıyor...",
      placeholder: "Mesajınızı yazın...",
      send: "Gönder",
      close: "Kapat",
      privacy: "Mesajlarınız Claude ile işlenir; bu tarayıcıya özel son 50 görüşme sunucuda saklanır. Paylaşılan cihazda geçmişi silin. Hassas bilgi paylaşmayın.",
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
      privacy: "Messages are processed by Claude; the last 50 conversations for this browser are stored on the server. Clear history on shared devices. Avoid sensitive information.",
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

  useEffect(() => {
    if (!memory.conversation) return;
    const saved = memory.conversation.messages.map(item => ({ text: item.content, isBot: item.role === "assistant" }));
    setMessages(saved.length ? saved : [{ text: language === "tr" ? "Merhaba, ben Lina. Ser Üretim Plastik için ihtiyacınıza uygun ambalajı seçmenize ve teklif talebinizi hazırlamanıza yardımcı olabilirim. Hangi ürün için görüşüyoruz?" : "Hello, I’m Lina. I help you choose Ser Üretim Plastik packaging and prepare your inquiry. Which product do you need?", isBot: true }]);
  }, [memory.conversation, language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || memory.busy || Boolean(memory.error)) return;
    microphone.stop();


    const current = generation.current;
    const history = messages.slice(-50).map((message) => ({
      role: message.isBot ? "assistant" : "user",
      content: message.text,
    }));

    setMessages((prev) => [...prev, { text, isBot: false }].slice(-50));
    setInputText("");
    setLoading(true);

    try {
      const data = await memory.send(text, history);
      if (current !== generation.current) return;
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
        {memory.available && <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-xs">
          <div className="flex items-center justify-between gap-2"><span className="text-slate-500">{language === "tr" ? "Size özel son 50 görüşme" : "Your last 50 conversations"}</span><div className="flex gap-3"><button disabled={loading || memory.busy} onClick={() => void memory.load(true)} className="font-semibold text-blue-800">{language === "tr" ? "+ Yeni" : "+ New"}</button><button disabled={loading || memory.busy} onClick={() => void memory.forget()} className="text-slate-500">{language === "tr" ? "Geçmişi sil" : "Clear history"}</button></div></div>
          <select aria-label={language === "tr" ? "Görüşme geçmişi" : "Conversation history"} value={memory.conversation?.id || ""} disabled={loading || memory.busy} onChange={event => void memory.load(false, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2">
            {!memory.conversations.length && <option value="">{language === "tr" ? "Geçmiş yükleniyor…" : "Loading history…"}</option>}
            {[...memory.conversations].reverse().map(item => <option key={item.id} value={item.id}>{new Date(item.createdAt).toLocaleDateString(language === "tr" ? "tr-TR" : "en-GB")} · {item.title || (language === "tr" ? "Yeni görüşme" : "New conversation")}</option>)}
          </select>
        </div>}
        {memory.error && <div role="status" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{memory.error}<button onClick={() => void memory.load(false, memory.conversation?.id)} className="ml-2 underline">{language === "tr" ? "Tekrar dene" : "Retry"}</button></div>}
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
                disabled={loading || memory.busy || Boolean(memory.error)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-[#0D47A1] transition hover:border-blue-200 hover:bg-blue-50"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {memory.conversation && Object.values(memory.conversation.draft).some(Boolean) && <div className="rounded-xl border border-blue-200 bg-white p-3 text-xs">
          <h4 className="mb-2 font-bold text-blue-900">{language === "tr" ? "Talep özeti — lütfen kontrol edin" : "Inquiry summary — please review"}</h4>
          <dl className="space-y-1">{Object.entries(memory.conversation.draft).filter(([, value]) => value).map(([key, value]) => <div key={key} className="grid grid-cols-[95px_1fr] gap-2"><dt className="text-slate-500">{({ name: ["Ad soyad", "Full name"], company: ["Firma", "Company"], phone: ["Telefon", "Phone"], email: ["E-posta", "Email"], product: ["Ürün", "Product"], size: ["Ölçü", "Size"], thickness: ["Mikron", "Thickness"], printing: ["Baskı", "Printing"], quantity: ["Miktar", "Quantity"], delivery: ["Teslim yeri", "Delivery"], notes: ["Not", "Notes"] } as Record<string, string[]>)[key]?.[language === "tr" ? 0 : 1]}</dt><dd className="break-words text-slate-700">{value}</dd></div>)}</dl>
          {memory.conversation.requestId ? <p role="status" className="mt-3 font-semibold text-green-800">{language === "tr" ? "Talep kaydı:" : "Inquiry record:"} {memory.conversation.requestId}</p> : <button disabled={!memory.conversation.ready || loading || memory.busy} onClick={() => void memory.confirmRequest()} className="mt-3 w-full rounded-lg bg-blue-900 px-3 py-2 font-semibold text-white disabled:opacity-40">{language === "tr" ? "Bilgileri onaylıyor, talebimi kaydediyorum" : "Confirm details and submit inquiry"}</button>}
          <p className="mt-2 text-[10px] text-slate-500">{language === "tr" ? "Bu bir teklif/sipariş talebidir; fiyat ve kesin sipariş onayı satış ekibine aittir." : "This is an inquiry; pricing and final order acceptance belong to the sales team."}</p>
          {memory.notification && <p role="status" className="mt-2 text-[10px] text-blue-800">{memory.notification}</p>}
        </div>}
        {(loading || memory.busy) && <div className="text-xs text-slate-400">{ui.typing}</div>}
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
            disabled={loading || memory.busy || Boolean(memory.error) || !inputText.trim()}
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
