// src/components/Chatbot.tsx

import { useState } from "react";
import { MessageCircle, X, Send, Phone, Mail } from "lucide-react";

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
  const [sendingMail, setSendingMail] = useState(false);

  const quickReplies = [
    "Ürünleriniz neler?",
    "Fiyat / Teklif almak istiyorum",
    "Üretim kapasiteniz",
    "İletişim bilgileri",
  ];

  const API_URL = import.meta.env.VITE_API_URL || "";

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

      const data = await res.json();

      setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
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
    if (messages.length <= 1) return; // Sadece karşılama mesajı varsa gönderme

    try {
      // Arka planda gönderim için
      fetch(`${API_URL}/api/send-transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }).catch(err => console.error("Transcript send error:", err));

    } catch (error) {
      console.error("Mail error:", error);
    }
  };

  const handleClose = () => {
    sendTranscript();
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/905336667381", "_blank");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50"
        aria-label="AI Destekli Canlı Sohbet"
      >
        <MessageCircle size={30} />
      </button>
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
        <div className="flex items-center gap-2">
          <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F4F6]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${msg.isBot
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
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-xs text-gray-500">🤖 Yazıyor...</div>
        )}
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D47A1]"
          />
          <button
            onClick={() => sendMessage(inputText)}
            className="bg-[#0D47A1] text-white px-4 rounded-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
