import { Award, Factory, Sparkles, Users } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function About() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Ser Plastik",
      title: "Üretim gücü, sade iletişim, uzun vadeli iş ortaklığı.",
      lead:
        "Denizli merkezli üretim yapımızla perakende, e-ticaret ve endüstriyel kullanım için plastik ambalaj çözümleri geliştiriyoruz.",
      body:
        "Standart ürün tedariğinin yanında; ölçü, kalınlık, baskı ve kullanım şartlarına göre özel üretim taleplerini de satış ekibimizle birlikte değerlendiriyoruz.",
      stat1: "Yerel üretim",
      stat2: "Özel üretim",
      stat3: "B2B çözüm",
      stat4: "Hızlı teklif",
    },
    en: {
      eyebrow: "Ser Plastik",
      title: "Manufacturing strength, clear communication, long-term partnership.",
      lead:
        "From our Denizli-based operation, we develop plastic packaging solutions for retail, e-commerce and industrial applications.",
      body:
        "In addition to standard supply, our sales team evaluates custom production requests based on dimensions, thickness, print and application requirements.",
      stat1: "Local production",
      stat2: "Custom production",
      stat3: "B2B solutions",
      stat4: "Fast quotation",
    },
  }[language];

  const stats = [
    { icon: Factory, label: copy.stat1 },
    { icon: Sparkles, label: copy.stat2 },
    { icon: Users, label: copy.stat3 },
    { icon: Award, label: copy.stat4 },
  ];

  return (
    <section id="hakkimizda" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
        <div>
          <span className="section-kicker">{copy.eyebrow}</span>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] text-[#071c3b] sm:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-700">{copy.lead}</p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">{copy.body}</p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
              >
                <Icon className="mb-4 text-[#0D47A1]" size={24} />
                <p className="text-sm font-bold leading-5 text-[#071c3b]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.4rem] bg-gradient-to-br from-blue-500/15 via-cyan-300/5 to-transparent blur-2xl" />
          <div className="group relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-[#071c3b] shadow-[0_35px_90px_rgba(7,28,59,.2)]">
            <img
              src="/images/Hakkımızda.png"
              alt="Ser Plastik production"
              className="h-[520px] w-full object-cover transition duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031126]/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-[#06172f]/70 p-5 text-white backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200/80">
                {language === "tr" ? "Denizli • Türkiye" : "Denizli • Türkiye"}
              </p>
              <p className="mt-2 text-lg font-bold">
                {language === "tr"
                  ? "Üretimden teslimata kadar tek noktadan ambalaj çözümü."
                  : "One-point packaging support from production to delivery."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
