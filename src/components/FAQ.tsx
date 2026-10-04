import { useLanguage } from "../LanguageContext";

export default function FAQ() {
  const { language } = useLanguage();

  const content = {
    tr: {
      eyebrow: "Sık Sorulan Sorular",
      title: "Teklif vermeden önce en çok sorulanlar.",
      items: [
        {
          q: "Hangi ürünleri üretiyorsunuz?",
          a: "Kargo poşetleri, endüstriyel ambalaj, naylon torbalar, çöp torbaları, jelatin ambalaj ve mıcıraltı naylon örtü başta olmak üzere farklı plastik ambalaj çözümleri üretiyoruz.",
        },
        {
          q: "Özel ölçü veya baskılı üretim yapıyor musunuz?",
          a: "Evet. Müşteri ihtiyacı, ürün özelliği ve kullanım alanına göre özel ölçü, baskı ve tasarım talepleri değerlendirilebilir.",
        },
        {
          q: "Yurt dışına satış yapıyor musunuz?",
          a: "Ser Üretim Plastik, yurt içi ve yurt dışındaki müşterilerine ambalaj çözümleri sunmaktadır.",
        },
        {
          q: "Teklif almak için hangi bilgileri vermeliyim?",
          a: "Ürün tipi, ölçü, kalınlık veya mikron, baskı isteği, miktar ve teslimat yeri biliniyorsa teklif süreci daha hızlı ilerler.",
        },
        {
          q: "Mimi ne yapabilir?",
          a: "Mimi, ürün ve teklif konularında kısa destek verir; talebinizi netleştirir ve iletişim bilgilerinizi bıraktığınızda satış ekibine iletilmek üzere lead kaydı oluşturulmasına yardımcı olur.",
        },
      ],
    },
    en: {
      eyebrow: "Frequently Asked Questions",
      title: "Common questions before requesting a quotation.",
      items: [
        {
          q: "What products do you manufacture?",
          a: "We manufacture courier bags, industrial packaging, plastic bags, garbage bags, transparent packaging, under-aggregate polyethylene sheets and other plastic packaging solutions.",
        },
        {
          q: "Can you manufacture custom sizes or printed products?",
          a: "Yes. Custom dimensions, printing and designs can be evaluated according to customer needs, product properties and application areas.",
        },
        {
          q: "Do you serve international customers?",
          a: "Yes. Ser Üretim Plastik serves both domestic and international customers.",
        },
        {
          q: "What information should I provide for a quotation?",
          a: "Product type, dimensions, thickness or micron, printing requirement, quantity and delivery destination help speed up the quotation process.",
        },
        {
          q: "What can Mimi do?",
          a: "Mimi provides short product and quotation support, helps clarify your request and can support lead capture for sales follow-up when you share contact details.",
        },
      ],
    },
  }[language];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <span className="section-kicker">{content.eyebrow}</span>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] text-[#071c3b] sm:text-6xl">
          {content.title}
        </h2>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {content.items.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-black text-[#071c3b]">
                <span>{item.q}</span>
                <span className="text-2xl font-light text-[#0D47A1] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-6 pr-10 leading-7 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
