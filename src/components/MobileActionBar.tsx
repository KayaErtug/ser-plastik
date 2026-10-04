import { MessageCircle, FileText } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function MobileActionBar() {
  const { language } = useLanguage();

  const quoteLabel = language === "en" ? "Quote" : "Teklif";
  const whatsappLabel = language === "en" ? "WhatsApp" : "WhatsApp";

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/15 bg-[#06172f]/92 p-2 shadow-[0_20px_55px_rgba(3,17,38,.38)] backdrop-blur-xl">
        <button
          onClick={() => document.getElementById("teklif")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-black text-[#071c3b]"
        >
          <FileText size={17} />
          {quoteLabel}
        </button>

        <a
          href="https://wa.me/905336667381"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-black text-white"
        >
          <MessageCircle size={17} />
          {whatsappLabel}
        </a>
      </div>
    </div>
  );
}
