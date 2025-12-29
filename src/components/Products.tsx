// src/components/Products.tsx

const products = [
  {
    title: "Naylon Torbalar / Poşetler",
    image: "/images/products/naylon.jpg",
    items: [
      "Baskılı / baskısız torbalar",
      "Kendinden yapışkanlı bantlı torbalar",
      "Market & mağaza poşetleri",
      "Atlet poşet",
      "Vestiyer poşet",
    ],
  },
  {
    title: "Jelatin / Şeffaf Ambalaj",
    image: "/images/products/jelatin.jpg",
    items: [
      "PP poşet",
      "PE şeffaf torba",
      "Fanlı / fansız jelatin torbalar",
      "Gıda ambalaj poşetleri",
      "Kırtasiye & tekstil ambalajları",
    ],
  },
  {
    title: "Endüstriyel Ambalaj",
    image: "/images/products/endustriyel.jpg",
    items: [
      "Streç film",
      "Palet örtüsü",
      "Shrink naylon",
      "Kolileme & paketleme naylonları",
      "Endüstriyel çöp torbaları",
    ],
  },
];

export default function Products() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Ürün Gruplarımız
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Geniş ürün yelpazemiz ile her sektöre özel ambalaj çözümleri sunuyoruz
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {product.title}
                </h3>

                <ul className="space-y-2 text-sm text-gray-700">
                  {product.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{item}</span>
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
