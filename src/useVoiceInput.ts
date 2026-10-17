import { useEffect, useRef, useState } from "react";

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function useVoiceInput(language: "tr" | "en", onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const engine = useRef<Recognition | null>(null);
  const callback = useRef(onText);
  callback.current = onText;
  const sw = window as SpeechWindow;
  const Constructor = sw.SpeechRecognition ?? sw.webkitSpeechRecognition;
  useEffect(() => {
    setListening(false);
    setError("");
    return () => { if (engine.current) { engine.current.onresult = null; engine.current.onerror = null; engine.current.onend = null; engine.current.abort(); engine.current = null; } };
  }, [language]);
  const stop = () => {
    const recognition = engine.current;
    engine.current = null;
    if (recognition) { recognition.onresult = null; recognition.onerror = null; recognition.onend = null; recognition.abort(); }
    setListening(false);
  };
  const start = () => {
    if (!Constructor) return;
    if (listening) { stop(); return; }
    setError("");
    window.speechSynthesis?.cancel();
    const recognition = new Constructor();
    engine.current = recognition;
    recognition.lang = language === "tr" ? "tr-TR" : "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = event => callback.current(event.results[0][0].transcript.trim().slice(0, 600));
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setError(language === "tr" ? "Mikrofon kullanılamadı. Mesajınızı yazarak devam edebilirsiniz." : "Microphone unavailable. Please type your message."); };
    try { recognition.start(); setListening(true); } catch { recognition.onerror?.(); }
  };
  return { supported: Boolean(Constructor), listening, error, start, stop };
}
