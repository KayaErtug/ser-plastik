// src/components/Chatbot.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";

interface Message {
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Merhaba! 🤖 Ser Plastik AI destekli canlı sohbete hoş geldiniz. Size nasıl yardımcı olabilirim?",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // İlk giriş tooltip (buton kapalıyken kısa süre göster)
  const [showHint, setShowHint] = useState(true);

  const quickReplies = useMemo(
    () => [
      "Ürünleriniz neler?",
      "Fiyat / Teklif almak istiyorum",
      "Üretim kapasiteniz",
      "İletişim bilgileri",
    ],
    []
  );

  // ✅ Doğru env: VITE_API_BASE_URL (ör: https://api.ser-plastik.com)
  // Fallback: VITE_API_URL (opsiyonel/eski)
  const API_URL =
    (import.meta.env.VITE_API_BASE_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "";

  // Auto-scroll referansı
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Buton tooltip 4 sn sonra kaybolsun
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Yeni mesajlarda otomatik aşağı kaydır
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { text, isBot: false }]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      // 4xx/5xx durumlarında json parse patlamasın diye
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data?.reply ?? "Yanıt alınamadı.", isBot: true },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text:
            "Şu anda bağlantı sağlanamadı. WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendTranscript = async () => {
    if (messages.length <= 1) return; // sadece karşılama varsa gönderme

    // Arka planda gönderim
    fetch(`${API_URL}/api/send-transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }).catch(() => {});
  };

  const handleClose = () => {
    sendTranscript();
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/905336667381", "_blank");
  };

  // Enter gönder, Shift+Enter alt satır
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (e.shiftKey) return; // input tek satır olduğu için pratikte alt satır yok, ama talebe göre davranış
    e.preventDefault();
    sendMessage(inputText);
  };

  // ✅ Kapalı buton: float + ping + glow + seyrek nudge + tooltip
  if (!isOpen) {
    return (
      <>
        <style>{`
          @keyframes chatFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-6px) scale(1.02); }
          }
          @keyframes chatNudge {
            0%, 92%, 100% { transform: translateY(0) rotate(0deg); }
            94% { transform: translateY(-2px) rotate(-6deg); }
            96% { transform: translateY(0) rotate(6deg); }
            98% { transform: translateY(-1px) rotate(-4deg); }
          }
          @keyframes chatGlow {
            0%, 100% { box-shadow: 0 14px 40px rgba(13,71,161,.35), 0 0 0 rgba(46,117,212,.0); }
            50% { box-shadow: 0 16px 50px rgba(13,71,161,.45), 0 0 26px rgba(46,117,212,.22); }
          }
          .chat-fab {
            animation:
              chatFloat 2.2s ease-in-out infinite,
              chatNudge 14s ease-in-out infinite,
              chatGlow 2.8s ease-in-out infinite;
          }
        `}</style>

        <div className="fixed bottom-6 right-6 z-50">
          {/* Tooltip (opsiyonel, kısa süre) */}
          {showHint && (
            <div className="absolute -top-14 right-0 mb-2">
              <div className="bg-white text-gray-900 text-sm px-4 py-2 rounded-xl shadow-lg border relative whitespace-nowrap">
                Hızlı teklif için yazın 👋
                <span className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-b border-r rotate-45" />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="chat-fab relative rounded-full p-4 text-white shadow-2xl
                       bg-gradient-to-br from-[#0D47A1] to-[#2E75D4]
                       hover:scale-110 transition will-change-transform"
            aria-label="AI Destekli Canlı Sohbet"
          >
            {/* Ping halkası */}
            <span className="absolute -inset-1 rounded-full bg-[#2E75D4]/30 animate-ping" />
            <span className="relative">
              <MessageCircle size={30} />
            </span>
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col h-[600px]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0D47A1] to-[#2E75D4] text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="font-bold">Ser Plastik</h3>
          <p className="text-xs opacity-80">🤖 AI Destekli Canlı Sohbet</p>
        </div>

        <button
          onClick={handleClose}
          className="hover:bg-white/20 p-1 rounded transition"
          aria-label="Kapat"
        >
          <X size={20} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F4F6]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.isBot
                  ? "bg-white text-gray-800 shadow"
                  : "bg-gradient-to-r from-[#0D47A1] to-[#2E75D4] text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {quickReplies.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="bg-white border text-[#0D47A1] px-3 py-2 rounded-lg text-sm hover:bg-[#0D47A1] hover:text-white transition"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="text-xs text-gray-500">🤖 Yazıyor...</div>}

        {/* Auto-scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t bg-white rounded-b-2xl">
        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white py-2 rounded-lg mb-2 flex items-center justify-center font-semibold"
        >
          <Phone className="mr-2" size={18} />
          WhatsApp ile İletişim
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D47A1] disabled:opacity-60"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(inputText)}
            className="bg-[#0D47A1] text-white px-4 rounded-lg disabled:opacity-60"
            disabled={loading || !inputText.trim()}
            aria-label="Gönder"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mt-2 text-[11px] text-gray-500">
          Enter: Gönder • (Shift+Enter: alt satır)
        </div>
      </div>
    </div>
  );
}
