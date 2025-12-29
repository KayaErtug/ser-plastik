import {
  ShoppingBag,
  Package,
  Factory,
  Truck,
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
      // üstteki yazıyı kadraj dışına almak için görseli aşağı kaydırıyoruz
      objectPosition: "center 78%",
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
      objectPosition: "center 78%",
    },
    {
      icon: Factory,
      title: "Endüstriyel Ambalaj",
      items: [
        "Streç film",
        "Palet örtüsü",
        "Shrink naylon",
        "Kolileme & paketleme naylonları",
        "Endüstriyel çöp torbaları",
      ],
      image: "/images/Endüstriyel Ambalaj.png",
      objectPosition: "center 78%",
    },
    {
      icon: Truck,
      title: "Kargo & E-Ticaret Ambalajları",
      items: [
        "Kargo poşeti",
        "Güvenlik bantlı poşet",
        "Kraft + plastik karışım poşet",
        "Askı delikli kargo torbaları",
        "Geri dönüşümlü poşetler",
      ],
      image: "/images/Kargo & E-Ticaret Ambalajları.png",
      objectPosition: "center 78%",
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
      objectPosition: "center 78%",
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
      objectPosition: "center 78%",
    },
  ];

  return (
    <section id="urunler" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ürün Gruplarımız</h2>
          <p className="text-gray-600">
            Geniş ürün yelpazemiz ile her sektöre özel ambalaj çözümleri sunuyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  style={{ objectPosition: product.objectPosition || "center 70%" }}
                />

                {/* hafif karartı + ikon (yazı yok) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-white/95 p-3 rounded-xl shadow">
                  <product.icon className="text-[#0D47A1]" size={26} />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product.title}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
}
