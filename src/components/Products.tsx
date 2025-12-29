import {
  ShoppingBag,
  Package,
  Factory,
  Truck,
  Sparkles,
  Recycle,
  Grid3x3,
} from "lucide-react";

export default function Products() {
  const products = [
    {
      icon: ShoppingBag,
      title: "Naylon Torbalar / Poşetler",
      items: [
        "Baskılı / baskısız torbalar",
        "Kendinden yapışkanlı bantlı torbalar",
        "Market & mağaza poşetleri",
        "Atlet poşet",
        "Vestiyer poşet",
        "Takviyeli tabanlı torbalar",
        "Rulo çöp poşetleri (küçük–orta–büyük–endüstriyel)",
      ],
      image: "/images/Naylon Torbalar  Poşetler.png",
    },
    {
      icon: Package,
      title: "Jelatin / Şeffaf Ambalaj",
      items: [
        "PP poşet",
        "PE şeffaf torba",
        "Fanlı / fansız jelatin torbalar",
        "Gıda ambalaj poşetleri",
        "Kırtasiye ve tekstil ambalajları",
      ],
      image: "/images/Jelatin Şeffaf Ambalaj.png",
    },
    {
      icon: Factory,
      title: "Endüstriyel Ambalaj",
      items: [
        "Streç film",
        "Palet örtüsü",
        "Shrink naylon",
        "Kolileme & paketleme nylonları",
        "Endüstriyel çöp torbaları",
      ],
      image: "/images/Endüstriyel Ambalaj.png",
    },
    {
      icon: Truck,
      title: "Kargo & E-Ticaret Ambalajları",
      items: [
        "Kargo poşeti",
        "Güvenlik bantlı poşet",
        "Hibrit kraft + plastik",
        "Etiket alanlı kargo torbaları",
        "Geri dönüşümlü poşetler",
      ],
      image: "/images/Kargo E-Ticaret Ambalajları.png",
    },
    {
      icon: Sparkles,
      title: "Özel Üretim & Esnek Ambalaj",
      items: [
        "Tırtıklı torbalar",
        "Askı delikli poşetler",
        "Çok katmanlı ambalaj",
        "Dondurulmuş gıda ambalajı",
      ],
      image: "/images/Özel Üretim Esnek Ambalajlar.png",
    },
    {
      icon: Recycle,
      title: "Geri Dönüşüm Ürünleri",
      items: [
        "Geri dönüştürülmüş hammadde poşetleri",
        "Atık poşetleri",
        "Doğada çözünebilen ambalaj türleri",
      ],
      image: "/images/Geri Dönüşüm Ürünleri.png",
    },
    {
      icon: Grid3x3,
      title: "Diğer Ürünler",
      items: [
        "Plastik masa örtüsü",
        "Sebze–meyve poşetleri",
        "Fırın torbaları",
        "Medikal atık poşetleri",
      ],
      image: "/images/Diğer Ürünler.png",
    },
  ];

  return (
    <section id="urunler" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0D47A1] mb-4">
            Ürün Gruplarımız
          </h2>
          <div className="w-24 h-1 bg-[#D32F2F] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Geniş ürün yelpazemiz ile her sektöre özel ambalaj çözümleri sunuyoruz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            const previewItems = product.items.slice(0, 3); // görüntü kirliliğini önlemek için

            return (
              <div
                key={index}
                className="bg-gradient-to-b from-white to-[#F4F4F6] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* IMAGE AREA */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />

                  {/* Dark gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"></div>

                  {/* Icon badge (safe inside) */}
                  <div className="absolute top-4 left-4 bg-white/95 p-3 rounded-lg shadow-lg">
                    <Icon className="text-[#0D47A1]" size={28} />
                  </div>

                  {/* ✅ Clean overlay: NEVER clipped, NEVER half visible */}
                  <div className="absolute left-4 right-4 bottom-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg overflow-hidden">
                      <div className="font-semibold text-[#0D47A1] text-sm mb-2 truncate">
                        {product.title}
                      </div>

                      <ul className="space-y-1">
                        {previewItems.map((it, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#D32F2F] mt-[2px]">▪</span>
                            <span className="text-gray-800 text-xs leading-5 truncate">
                              {it}
                            </span>
                          </li>
                        ))}
                        {product.items.length > 3 && (
                          <li className="text-xs text-gray-700/80 pl-4 truncate">
                            …ve daha fazlası
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h3>
                  <ul className="space-y-2">
                    {product.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-[#D32F2F] mr-2 mt-1">▪</span>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
