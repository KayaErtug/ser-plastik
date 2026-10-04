import { PackageCheck, Printer, Scissors, Settings, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Production() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Üretim",
      title: "Siparişten sevkiyata kontrollü üretim akışı.",
      description:
        "İhtiyacın netleştirilmesinden baskı, kesim, paketleme ve son kontrole kadar süreci düzenli bir iş akışıyla yönetiyoruz.",
      machine: "Üretim altyapısı",
      quality: "Son kontrol & paketleme",
    },
    en: {
      eyebrow: "Production",
      title: "A controlled workflow from order to dispatch.",
      description:
        "From requirement clarification to printing, cutting, packing and final checks, we manage production through a clear operational flow.",
      machine: "Production infrastructure",
      quality: "Final check & packing",
    },
  }[language];

  const steps = [
    {
      icon: Settings,
      tr: ["İhtiyaç Analizi", "Ürün tipi, ölçü, kalınlık, baskı ve miktar netleştirilir."],
      en: ["Requirement Review", "Product type, dimensions, thickness, print and quantity are clarified."],
    },
    {
      icon: Zap,
      tr: ["Film Üretimi", "Uygulamaya uygun hammadde ve üretim parametreleri hazırlanır."],
      en: ["Film Production", "Material and production parameters are prepared for the application."],
    },
    {
      icon: Printer,
      tr: ["Baskı", "Talebe göre marka ve tasarım baskısı üretim akışına alınır."],
      en: ["Printing", "Brand and artwork printing is added to the workflow when requested."],
    },
    {
      icon: Scissors,
      tr: ["Kesim & Form", "Ürün, sipariş ölçülerine ve kullanım şekline göre form kazanır."],
      en: ["Cutting & Forming", "The product is formed according to order dimensions and intended use."],
    },
    {
      icon: PackageCheck,
      tr: ["Paketleme", "Ürünler sevkiyat ve kullanım şartlarına uygun biçimde paketlenir."],
      en: ["Packing", "Products are packed according to handling and shipment requirements."],
    },
    {
      icon: ShieldCheck,
      tr: ["Son Kontrol", "Sipariş detayları ve ürün görünümü sevkiyat öncesinde kontrol edilir."],
      en: ["Final Check", "Order details and product appearance are checked before dispatch."],
    },
  ];

  return (
    <section id="uretim" className="relative overflow-hidden bg-[#071c3b] py-24 text-white sm:py-32">
      <div className="absolute inset-0 premium-grid opacity-20" />
      <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <span className="section-kicker !text-cyan-200">{copy.eyebrow}</span>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.04em] sm:text-6xl">{copy.title}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-white/65 lg:justify-self-end">{copy.description}</p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const [title, description] = step[language];
            const Icon = step.icon;

            return (
              <article
                key={title}
                className="group rounded-[1.6rem] border border-white/10 bg-white/[.055] p-6 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[.085]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
                    <Icon size={21} />
                  </div>
                  <span className="text-3xl font-black text-white/10 transition group-hover:text-white/20">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-white/58">{description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {[
            ["/images/production-line.png", copy.machine],
            ["/images/quality-control.png", copy.quality],
          ].map(([image, label]) => (
            <div key={image} className="group relative h-[340px] overflow-hidden rounded-[2rem]">
              <img src={image} alt={label} className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031126] via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 text-2xl font-black tracking-[-.02em]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
