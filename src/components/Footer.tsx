import { Phone } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      description: "Ser Plastik; perakende, e-ticaret ve endüstriyel kullanım için plastik ambalaj çözümleri üretir.",
      products: "Ürünler",
      links: "Hızlı Erişim",
      contact: "İletişim",
      home: "Ana Sayfa",
      about: "Hakkımızda",
      production: "Üretim",
      quote: "Teklif Al",
      whatsapp: "WhatsApp ile İletişim",
      rights: "Tüm hakları saklıdır.",
      privacy: "Gizlilik",
      terms: "Kullanım Koşulları",
      kvkk: "KVKK",
    },
    en: {
      description: "Ser Plastik produces plastic packaging solutions for retail, e-commerce and industrial applications.",
      products: "Products",
      links: "Quick Links",
      contact: "Contact",
      home: "Home",
      about: "About",
      production: "Production",
      quote: "Request Quote",
      whatsapp: "Contact on WhatsApp",
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms of Use",
      kvkk: "Data Protection",
    },
  }[language];

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const productNames =
    language === "en"
      ? ["Courier Bags", "Industrial Packaging", "Plastic Bags", "Garbage Bags", "Transparent Packaging", "Under-Aggregate PE Sheet"]
      : ["Kargo Poşetleri", "Endüstriyel Ambalaj", "Naylon Torbalar", "Çöp Torbaları", "Jelatin Ambalaj", "Mıcıraltı Naylon Örtü"];

  const links = [
    ["anasayfa", copy.home],
    ["hakkimizda", copy.about],
    ["urunler", copy.products],
    ["uretim", copy.production],
    ["teklif", copy.quote],
    ["iletisim", copy.contact],
  ];

  return (
    <footer className="relative overflow-hidden bg-[#031126] pb-8 pt-16 text-white">
      <div className="absolute inset-0 premium-grid opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Ser Plastik" className="h-16 w-auto" />
            <p className="mt-5 max-w-sm leading-7 text-white/60">{copy.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[.18em] text-white/[0.45]">{copy.products}</h3>
            <ul className="mt-5 space-y-3">
              {productNames.map((item) => (
                <li key={item}>
                  <button onClick={() => scrollTo("urunler")} className="text-left text-sm text-white/[0.65] transition hover:text-white">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[.18em] text-white/[0.45]">{copy.links}</h3>
            <ul className="mt-5 space-y-3">
              {links.map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-left text-sm text-white/[0.65] transition hover:text-white">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[.18em] text-white/[0.45]">{copy.contact}</h3>
            <div className="mt-5 space-y-4 text-sm text-white/[0.65]">
              <p>Hacıeyüplü Mah. 3101 Sokak No: 27/1<br />Merkezefendi / Denizli / Türkiye</p>
              <a href="tel:02583713050" className="flex items-center gap-2 transition hover:text-white">
                <Phone size={15} /> 0258 371 30 50
              </a>
              <a href="tel:+905336667381" className="flex items-center gap-2 transition hover:text-white">
                <Phone size={15} /> +90 533 666 73 81
              </a>
              <a href="mailto:info@ser-plastik.com" className="block transition hover:text-white">info@ser-plastik.com</a>
            </div>

            <a
              href="https://wa.me/905336667381"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#20BA5A]"
            >
              {copy.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-white/[0.45] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ser Üretim Plastik Sanayi Limited Şirketi. {copy.rights}</p>
          <div className="flex flex-wrap gap-5">
            <button onClick={() => scrollTo("privacy")} className="transition hover:text-white">{copy.privacy}</button>
            <button onClick={() => scrollTo("privacy")} className="transition hover:text-white">{copy.kvkk}</button>
            <span>{copy.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
