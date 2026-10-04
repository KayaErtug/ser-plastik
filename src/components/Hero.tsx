import { ArrowDown, ArrowRight, MessageCircleMore } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Hero() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Denizli'den profesyonel ambalaj üretimi",
      title: "Ambalajı yalnız üretmiyoruz.",
      accent: "Markanızı taşıyan çözümler tasarlıyoruz.",
      description:
        "Ser Plastik; perakende, e-ticaret ve endüstriyel kullanım için güvenilir, özelleştirilebilir plastik ambalaj çözümleri sunar.",
      products: "Ürünleri İncele",
      quote: "Teklif Al",
      mimi: "Mimi ile konuş",
      marquee:
        "ÖZEL ÜRETİM • BASKILI POŞET • KARGO AMBALAJI • ENDÜSTRİYEL AMBALAJ • HIZLI TEKLİF • DENİZLİ'DEN ÜRETİM",
      scroll: "Keşfet",
      experience: "20 yıllık üretim deneyimi",
      market: "Yurt içi & yurt dışı",
    },
    en: {
      eyebrow: "Professional packaging production from Denizli",
      title: "We do more than manufacture packaging.",
      accent: "We create solutions that carry your brand.",
      description:
        "Ser Plastik delivers reliable, customizable plastic packaging solutions for retail, e-commerce and industrial applications.",
      products: "Explore Products",
      quote: "Request Quote",
      mimi: "Talk to Mimi",
      marquee:
        "CUSTOM PRODUCTION • PRINTED BAGS • COURIER PACKAGING • INDUSTRIAL PACKAGING • FAST QUOTATION • MADE IN DENIZLI",
      scroll: "Explore",
      experience: "20 years of production experience",
      market: "Domestic & international",
    },
  }[language];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="anasayfa" className="relative min-h-[100svh] overflow-hidden bg-[#031126] text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/production-line.png"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      >
        <source src="/images/background videosu.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(2,13,31,.96)_0%,rgba(3,26,59,.86)_45%,rgba(3,17,38,.48)_100%)]" />
      <div className="absolute inset-0 premium-grid opacity-25" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute -right-36 bottom-0 h-[30rem] w-[30rem] rounded-full bg-cyan-300/10 blur-[140px]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-32 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        <div className="max-w-5xl">
          <div className="reveal-up mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.22em] text-white/75 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.8)]" />
            {copy.eyebrow}
          </div>

          <h1 className="reveal-up-delay max-w-5xl text-[2.65rem] font-black leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-8xl">
            {copy.title}
            <span className="mt-3 block text-gradient-premium">{copy.accent}</span>
          </h1>

          <p className="reveal-up-delay-2 mt-8 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
            {copy.description}
          </p>

          <div className="reveal-up-delay-3 mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.16em] text-white/65">
            <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 backdrop-blur">{copy.experience}</span>
            <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 backdrop-blur">{copy.market}</span>
          </div>

          <div className="reveal-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => scrollTo("urunler")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-[#07234b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(255,255,255,.18)]"
            >
              {copy.products}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("teklif")}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/16"
            >
              {copy.quote}
            </button>
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Mimi - Ser Plastik AI Satış Asistanı"]')?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-6 py-3.5 font-bold text-cyan-50 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-cyan-300/15"
            >
              <MessageCircleMore size={18} />
              {copy.mimi}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-white/10 bg-[#071c3b]/78 py-4 backdrop-blur-xl">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap text-xs font-bold tracking-[.2em] text-white/60">
          {[0, 1].map((group) => (
            <span key={group} className="flex items-center gap-10">
              {copy.marquee}
              <span className="text-cyan-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollTo("hakkimizda")}
        className="absolute bottom-24 right-4 z-20 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-white/45 transition hover:text-white md:flex"
      >
        {copy.scroll}
        <ArrowDown size={16} className="animate-bounce" />
      </button>
    </section>
  );
}
