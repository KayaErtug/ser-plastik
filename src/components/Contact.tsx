import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Contact() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "İletişim",
      title: "Satış, üretim ve teklif talepleriniz için bize ulaşın.",
      description: "Telefon, WhatsApp veya e-posta üzerinden iletişime geçebilirsiniz.",
      address: "Adres",
      phone: "Telefon",
      email: "E-posta",
      hours: "Çalışma Saatleri",
      weekdays: "Pazartesi - Cuma: 08:00 - 18:00",
      saturday: "Cumartesi: 09:00 - 13:00",
      corporate: "Kurumsal Bilgiler",
      taxOffice: "Vergi Dairesi",
      taxNo: "Vergi No",
      registry: "Ticaret Sicil No",
      mersis: "MERSİS No",
    },
    en: {
      eyebrow: "Contact",
      title: "Reach us for sales, production and quotation requests.",
      description: "Contact us by phone, WhatsApp or e-mail.",
      address: "Address",
      phone: "Phone",
      email: "E-mail",
      hours: "Business Hours",
      weekdays: "Monday - Friday: 08:00 - 18:00",
      saturday: "Saturday: 09:00 - 13:00",
      corporate: "Corporate Information",
      taxOffice: "Tax Office",
      taxNo: "Tax No",
      registry: "Trade Registry No",
      mersis: "MERSIS No",
    },
  }[language];

  const cards = [
    {
      icon: MapPin,
      title: copy.address,
      content: (
        <p className="leading-7 text-slate-600">
          Hacıeyüplü Mah. 3101 Sokak No: 27/1<br />
          Merkezefendi / Denizli / Türkiye
        </p>
      ),
    },
    {
      icon: Phone,
      title: copy.phone,
      content: (
        <div className="space-y-1">
          <a href="tel:02583713050" className="block font-semibold text-slate-700 transition hover:text-[#0D47A1]">0258 371 30 50</a>
          <a href="tel:+905336667381" className="block font-semibold text-slate-700 transition hover:text-[#0D47A1]">+90 533 666 73 81</a>
        </div>
      ),
    },
    {
      icon: Mail,
      title: copy.email,
      content: (
        <a href="mailto:info@ser-plastik.com" className="font-semibold text-slate-700 transition hover:text-[#0D47A1]">
          info@ser-plastik.com
        </a>
      ),
    },
    {
      icon: Clock,
      title: copy.hours,
      content: (
        <p className="leading-7 text-slate-600">
          {copy.weekdays}<br />
          {copy.saturday}
        </p>
      ),
    },
  ];

  return (
    <section id="iletisim" className="relative overflow-hidden bg-[#eef3f9] py-24 sm:py-32">
      <div className="absolute inset-0 premium-grid opacity-[.035]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="section-kicker">{copy.eyebrow}</span>
          <h2 className="mt-4 text-4xl font-black tracking-[-.04em] text-[#071c3b] sm:text-6xl">{copy.title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">{copy.description}</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, title, content }) => (
              <div key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D47A1] text-white">
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 text-lg font-black text-[#071c3b]">{title}</h3>
                <div className="mt-2">{content}</div>
              </div>
            ))}

            <div className="sm:col-span-2 rounded-[1.5rem] bg-[#071c3b] p-6 text-white">
              <h3 className="text-xl font-black">{copy.corporate}</h3>
              <div className="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
                <p><strong className="text-white">{copy.taxOffice}:</strong> Gökpınar V.D.</p>
                <p><strong className="text-white">{copy.taxNo}:</strong> 761 100 0051</p>
                <p><strong className="text-white">{copy.registry}:</strong> 44621</p>
                <p><strong className="text-white">{copy.mersis}:</strong> 07611100005100001</p>
              </div>
            </div>
          </div>

          <div className="min-h-[560px] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_80px_rgba(7,28,59,.12)]">
            <iframe
              src="https://www.google.com/maps?q=Hac%C4%B1ey%C3%BCpl%C3%BC%20Mah.%203101%20Sokak%20No%3A%2027%2F1%20Merkezefendi%20Denizli%20T%C3%BCrkiye&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 560 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ser Plastik"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
