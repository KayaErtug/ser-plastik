import { ArrowUpRight, Factory, Grid3x3, Package, Recycle, ShoppingBag, Truck } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Products() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Ürün Grupları",
      title: "Her kullanım için doğru ambalaj.",
      description:
        "Standart ürünlerden özel baskılı üretime kadar, markanızın ve operasyonunuzun ihtiyacına göre çözüm geliştiriyoruz.",
      details: "Detaylı teklif al",
    },
    en: {
      eyebrow: "Product Range",
      title: "The right packaging for every application.",
      description:
        "From standard products to custom printed production, we build solutions around your brand and operational needs.",
      details: "Request a detailed quote",
    },
  }[language];

  const products = [
    {
      icon: ShoppingBag,
      image: "/images/Naylon Torbalar  Poşetler.png",
      tr: {
        title: "Naylon Torbalar & Poşetler",
        text: "Market, mağaza, atlet, vestiyer ve özel ölçülü baskılı/baskısız çözümler.",
      },
      en: {
        title: "Plastic Bags & Carrier Bags",
        text: "Retail, market, vest, garment and custom-size printed or unprinted solutions.",
      },
    },
    {
      icon: Package,
      image: "/images/Jelatin Şeffaf Ambalaj.png",
      tr: {
        title: "Şeffaf Ambalaj",
        text: "PP/PE şeffaf torba, fanlı-fansız ambalaj ve tekstil/gıda uygulamaları.",
      },
      en: {
        title: "Transparent Packaging",
        text: "PP/PE transparent bags, gusseted packaging and textile/food applications.",
      },
    },
    {
      icon: Factory,
      image: "/images/Endüstriyel Ambalaj.png",
      tr: {
        title: "Endüstriyel Ambalaj",
        text: "Streç film, shrink naylon, palet örtüsü ve ağır kullanım ambalajları.",
      },
      en: {
        title: "Industrial Packaging",
        text: "Stretch film, shrink film, pallet covers and heavy-duty packaging solutions.",
      },
    },
    {
      icon: Truck,
      image: "/images/Kargo E-Ticaret Ambalajları.png",
      tr: {
        title: "Kargo & E-Ticaret",
        text: "Güvenlik bantlı, baskılı ve operasyonunuza özel kargo poşetleri.",
      },
      en: {
        title: "Courier & E-Commerce",
        text: "Security-sealed, printed and operation-specific courier mailer solutions.",
      },
    },
    {
      icon: Recycle,
      image: "/images/Geri Dönüşüm Ürünleri.png",
      tr: {
        title: "Geri Dönüşüm Ürünleri",
        text: "Geri dönüştürülmüş hammadde seçenekleri ve atık yönetimi ürünleri.",
      },
      en: {
        title: "Recycled Products",
        text: "Recycled-material options and packaging solutions for waste management.",
      },
    },
    {
      icon: Grid3x3,
      image: "/images/Özel Üretim Esnek Ambalajlar.png",
      tr: {
        title: "Özel Üretim",
        text: "Ölçü, kalınlık, baskı ve kullanım alanına göre geliştirilen özel çözümler.",
      },
      en: {
        title: "Custom Production",
        text: "Purpose-built solutions tailored by dimensions, thickness, print and application.",
      },
    },
  ];

  return (
    <section id="urunler" className="relative overflow-hidden bg-[#eef3f9] py-24 sm:py-32">
      <div className="absolute inset-0 premium-grid opacity-[.04]" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <span className="section-kicker">{copy.eyebrow}</span>
            <h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-.04em] text-[#071c3b] sm:text-6xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const item = product[language];
            const Icon = product.icon;

            return (
              <article
                key={product.image}
                className="premium-product-card group relative min-h-[430px] overflow-hidden rounded-[2rem] bg-[#071c3b]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <img
                  src={product.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031126] via-[#071c3b]/40 to-transparent transition duration-500 group-hover:via-[#071c3b]/25" />

                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white backdrop-blur-xl">
                  <Icon size={23} />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <span className="mb-3 block text-xs font-bold uppercase tracking-[.2em] text-cyan-200/80">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl font-black tracking-[-.025em] text-white">{item.title}</h3>
                  <p className="mt-3 max-w-sm leading-6 text-white/68">{item.text}</p>

                  <button
                    onClick={() => document.getElementById("teklif")?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-cyan-200"
                  >
                    {copy.details}
                    <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
