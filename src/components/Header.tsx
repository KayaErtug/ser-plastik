import { useEffect, useState } from "react";
import { Languages, Menu, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const copy = {
    tr: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      products: "Ürünler",
      production: "Üretim",
      quote: "Teklif Al",
      contact: "İletişim",
      menu: "Menüyü aç / kapat",
    },
    en: {
      home: "Home",
      about: "About",
      products: "Products",
      production: "Production",
      quote: "Request Quote",
      contact: "Contact",
      menu: "Open / close menu",
    },
  }[language];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const items = [
    ["anasayfa", copy.home],
    ["hakkimizda", copy.about],
    ["urunler", copy.products],
    ["uretim", copy.production],
    ["teklif", copy.quote],
    ["iletisim", copy.contact],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#06172f]/[0.92] backdrop-blur-xl shadow-[0_18px_50px_rgba(1,14,35,.24)] border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => scrollToSection("anasayfa")} className="group flex items-center" aria-label="Ser Plastik">
          <img
            src="/logo.png"
            alt="Ser Plastik"
            className="h-12 w-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {items.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="relative text-sm font-semibold tracking-wide text-white/[0.85] transition hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-full border border-white/[0.15] bg-white/10 p-1 backdrop-blur md:flex">
            {(["tr", "en"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setLanguage(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wider transition ${
                  language === item ? "bg-white text-[#082652]" : "text-white/70 hover:text-white"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen((value) => !value)}
            className="rounded-full border border-white/[0.15] bg-white/10 p-2.5 text-white backdrop-blur lg:hidden"
            aria-label={copy.menu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-[#06172f]/[0.97] px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {items.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="rounded-xl px-4 py-3 text-left font-medium text-white/[0.85] transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </button>
            ))}
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-white">
              <Languages size={18} />
              <button onClick={() => setLanguage("tr")} className={language === "tr" ? "font-bold" : "opacity-60"}>TR</button>
              <span className="opacity-30">/</span>
              <button onClick={() => setLanguage("en")} className={language === "en" ? "font-bold" : "opacity-60"}>EN</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
