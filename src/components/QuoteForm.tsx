import { useState } from "react";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function QuoteForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: "",
    size: "",
    printing: "no",
    quantity: "",
    message: "",
  });

  const copy = {
    tr: {
      eyebrow: "Hızlı Teklif",
      title: "İhtiyacınızı anlatın, satış ekibimize ulaştırın.",
      description:
        "Ürün, ölçü, baskı ve miktar bilgilerinizi paylaşın. Form, hazırlanmış talebinizi doğrudan WhatsApp’a aktarır.",
      name: "Ad Soyad",
      company: "Firma",
      phone: "Telefon",
      email: "E-posta",
      product: "Ürün",
      size: "Ölçü / Mikron",
      printing: "Baskı",
      quantity: "Miktar",
      message: "Notunuz",
      select: "Ürün seçin",
      yes: "Evet",
      no: "Hayır",
      submit: "WhatsApp ile Teklif Talep Et",
      placeholders: {
        name: "Adınız ve soyadınız",
        company: "Firma adı",
        phone: "+90 5xx xxx xx xx",
        email: "ornek@firma.com",
        size: "Örn: 30x40 cm, 50 mikron",
        quantity: "Örn: 10.000 adet",
        message: "Teslimat, baskı veya diğer detaylar...",
      },
    },
    en: {
      eyebrow: "Fast Quotation",
      title: "Tell us what you need and send it directly to sales.",
      description:
        "Share product, dimensions, printing and quantity. The form prepares your request and transfers it directly to WhatsApp.",
      name: "Full Name",
      company: "Company",
      phone: "Phone",
      email: "E-mail",
      product: "Product",
      size: "Dimensions / Micron",
      printing: "Printing",
      quantity: "Quantity",
      message: "Notes",
      select: "Select a product",
      yes: "Yes",
      no: "No",
      submit: "Request Quote on WhatsApp",
      placeholders: {
        name: "Your full name",
        company: "Company name",
        phone: "+90 5xx xxx xx xx",
        email: "name@company.com",
        size: "e.g. 30x40 cm, 50 micron",
        quantity: "e.g. 10,000 pcs",
        message: "Delivery, printing or other details...",
      },
    },
  }[language];

  const products =
    language === "en"
      ? ["Courier Bags", "Industrial Packaging", "Plastic Bags", "Garbage Bags", "Transparent Packaging", "Under-Aggregate PE Sheet", "Other"]
      : ["Kargo Poşetleri", "Endüstriyel Ambalaj", "Naylon Torbalar", "Çöp Torbaları", "Jelatin Ambalaj", "Mıcıraltı Naylon Örtü", "Diğer"];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition focus:border-[#0D47A1] focus:ring-4 focus:ring-blue-100";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const lines =
      language === "en"
        ? [
            "*Quotation Request*",
            "",
            `*Name:* ${formData.name}`,
            `*Company:* ${formData.company || "-"}`,
            `*Phone:* ${formData.phone}`,
            `*E-mail:* ${formData.email}`,
            "",
            `*Product:* ${formData.product}`,
            `*Dimensions/Micron:* ${formData.size || "-"}`,
            `*Printing:* ${formData.printing === "yes" ? "Yes" : "No"}`,
            `*Quantity:* ${formData.quantity}`,
            "",
            `*Notes:* ${formData.message || "-"}`,
          ]
        : [
            "*Teklif Talebi*",
            "",
            `*Ad Soyad:* ${formData.name}`,
            `*Firma:* ${formData.company || "-"}`,
            `*Telefon:* ${formData.phone}`,
            `*E-posta:* ${formData.email}`,
            "",
            `*Ürün:* ${formData.product}`,
            `*Ölçü/Mikron:* ${formData.size || "-"}`,
            `*Baskı:* ${formData.printing === "yes" ? "Evet" : "Hayır"}`,
            `*Miktar:* ${formData.quantity}`,
            "",
            `*Not:* ${formData.message || "-"}`,
          ];

    window.open(
      `https://wa.me/905336667381?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  };

  return (
    <section id="teklif" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span className="section-kicker">{copy.eyebrow}</span>
          <h2 className="mt-4 text-4xl font-black tracking-[-.04em] text-[#071c3b] sm:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{copy.description}</p>

          <div className="mt-8 rounded-[1.6rem] bg-[#071c3b] p-6 text-white">
            <MessageCircleMore className="text-cyan-200" size={27} />
            <p className="mt-4 font-bold">
              {language === "en" ? "Need help preparing the request?" : "Talebi hazırlarken yardıma mı ihtiyacınız var?"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {language === "en"
                ? "Open Mimi and describe the product you need."
                : "Mimi’yi açın ve ihtiyacınız olan ürünü tarif edin."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-[#f8fafc] p-5 shadow-[0_30px_80px_rgba(7,28,59,.09)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={copy.name}>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder={copy.placeholders.name} />
            </Field>
            <Field label={copy.company}>
              <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} placeholder={copy.placeholders.company} />
            </Field>
            <Field label={copy.phone}>
              <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder={copy.placeholders.phone} />
            </Field>
            <Field label={copy.email}>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder={copy.placeholders.email} />
            </Field>
            <Field label={copy.product}>
              <select required value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className={inputClass}>
                <option value="">{copy.select}</option>
                {products.map((product) => <option key={product} value={product}>{product}</option>)}
              </select>
            </Field>
            <Field label={copy.quantity}>
              <input required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className={inputClass} placeholder={copy.placeholders.quantity} />
            </Field>
            <Field label={copy.size}>
              <input value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className={inputClass} placeholder={copy.placeholders.size} />
            </Field>
            <Field label={copy.printing}>
              <select value={formData.printing} onChange={(e) => setFormData({ ...formData, printing: e.target.value })} className={inputClass}>
                <option value="no">{copy.no}</option>
                <option value="yes">{copy.yes}</option>
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label={copy.message}>
              <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={inputClass + " resize-none"} placeholder={copy.placeholders.message} />
            </Field>
          </div>

          <button
            type="submit"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D47A1] px-5 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-[#082f73] hover:shadow-xl"
          >
            {copy.submit}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
