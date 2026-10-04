import { Factory, Package, ShoppingBag, Trash2, Truck, Layers3 } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Products() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Ürün Grupları",
      title: "Farklı kullanım alanları için esnek ambalaj çözümleri.",
      description:
        "Kargo poşetlerinden endüstriyel ambalaja, naylon torbalardan mıcıraltı örtülere kadar farklı ihtiyaçlara yönelik üretim yapıyoruz.",
      details: "Teklif al",
    },
    en: {
      eyebrow: "Product Range",
      title: "Flexible packaging solutions for different applications.",
      description:
        "From courier bags and industrial packaging to plastic bags and under-aggregate polyethylene sheets, we manufacture for a wide range of needs.",
      details: "Request quote",
    },
  }[language];

  const products = [
    {
      icon: Truck,
      image: "/images/Kargo E-Ticaret Ambalajları.png",
      tr: {
        title: "Kargo Poşetleri",
        text: "E-ticaret ve sevkiyat operasyonları için güvenlik bantlı, baskılı veya baskısız kargo poşetleri.",
      },
      en: {
        title: "Courier Bags",
        text: "Security-sealed, printed or unprinted courier bags for e-commerce and shipping operations.",
      },
    },
    {
      icon: Factory,
      image: "/images/Endüstriyel Ambalaj.png",
      tr: {
        title: "Endüstriyel Ambalaj",
        text: "Farklı üretim ve paketleme ihtiyaçlarına yönelik dayanıklı endüstriyel ambalaj çözümleri.",
      },
      en: {
        title: "Industrial Packaging",
        text: "Durable industrial packaging solutions for different production and packing requirements.",
      },
    },
    {
      icon: ShoppingBag,
      image: "/images/Naylon Torbalar  Poşetler.png",
      tr: {
        title: "Naylon Torbalar",
        text: "Baskılı, baskısız, takviyeli ve farklı kullanım alanlarına göre özel ölçülü naylon torba üretimi.",
      },
      en: {
        title: "Plastic Bags",
        text: "Printed, unprinted, reinforced and custom-sized plastic bags for different applications.",
      },
    },
    {
      icon: Trash2,
      image: "/images/Geri Dönüşüm Ürünleri.png",
      tr: {
        title: "Çöp Torbaları",
        text: "Evsel, ticari ve farklı kullanım alanlarına yönelik çeşitli ölçü ve dayanım seçenekleri.",
      },
      en: {
        title: "Garbage Bags",
        text: "Multiple size and strength options for household, commercial and other applications.",
      },
    },
    {
      icon: Package,
      image: "/images/Jelatin Şeffaf Ambalaj.png",
      tr: {
        title: "Jelatin Ambalaj",
        text: "Şeffaf sunum ve koruma gereken ürünler için farklı ölçülerde jelatin ambalaj çözümleri.",
      },
      en: {
        title: "Transparent Packaging",
        text: "Transparent packaging solutions in different sizes for products requiring visibility and protection.",
      },
    },
    {
      icon: Layers3,
      image: "/images/Diğer Ürünler.png",
      tr: {
        title: "Mıcıraltı Naylon Örtü",
        text: "İnşaat ve zemin uygulamalarında kullanım için farklı ölçü ve kalınlıklarda naylon örtü çözümleri.",
      },
      en: {
        title: "Under-Aggregate PE Sheet",
        text: "Polyethylene sheet solutions in different dimensions and thicknesses for construction and ground applications.",
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
                key={item.title}
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
