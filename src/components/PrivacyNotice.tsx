import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function PrivacyNotice() {
  const { language } = useLanguage();

  const copy = {
    tr: {
      eyebrow: "Veri Kullanımı",
      title: "Talep bilgileriniz yalnızca size dönüş yapmak için kullanılır.",
      body:
        "Teklif formu veya Lina üzerinden paylaştığınız ad, firma, telefon, e-posta ve talep detayları yalnızca talebinizi değerlendirmek ve satış ekibimizin size dönüş yapmasını sağlamak amacıyla işlenir. Lina mesajları yanıt üretmek için Claude hizmetine iletilir. Bu tarayıcıya özel son 50 görüşme ve her görüşmenin son 50 mesajı sunucuda saklanır. Sohbet içinden geçmişi silebilirsiniz; ayrıca onaylayarak gönderdiğiniz talepler satış takibi için korunur. Kaydedilen talepler yönetici e-posta bildirim kuyruğuna alınır. Veri talepleri: serplastik@outlook.com.",
      note:
        "Bu bölüm genel bilgilendirme niteliğindedir. Nihai KVKK ve gizlilik metinleri şirketin hukuk danışmanı tarafından onaylanmalıdır.",
    },
    en: {
      eyebrow: "Data Use",
      title: "Your inquiry details are used only to respond to your request.",
      body:
        "Name, company, phone, e-mail and inquiry details shared through the quotation form or Lina are processed only to evaluate your request and allow the sales team to follow up. Lina messages are processed by Claude to generate replies. The last 50 conversations for this browser and the last 50 messages of each are stored on the server. You can clear chat history; separately submitted inquiries are retained for sales follow-up and queued for manager email notification. Data requests: serplastik@outlook.com.",
      note:
        "This section is a general notice. Final privacy and data-protection texts should be reviewed and approved by the company’s legal adviser.",
    },
  }[language];

  return (
    <section id="privacy" className="bg-[#071c3b] py-16 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8">
          <ShieldCheck className="text-cyan-200" size={28} />
          <span className="mt-5 block text-xs font-black uppercase tracking-[.2em] text-cyan-200/80">
            {copy.eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-[-.025em] sm:text-3xl">{copy.title}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-white/70">{copy.body}</p>
          <p className="mt-4 text-xs leading-5 text-white/40">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}
