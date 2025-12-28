export function fallbackReply(intent) {
    const map = {
      greeting: "Merhaba 👋 Ser Plastik’e hoş geldiniz. Size nasıl yardımcı olabilirim?",
      product: "Naylon torba, jelatin ambalaj, endüstriyel ve özel üretim ambalaj çözümleri sunuyoruz.",
      sales: "Fiyat ve teklif talepleriniz için satış ekibimiz size yardımcı olacaktır.",
      contact: "Telefon: 0258 371 30 50\nE-posta: info@ser-plastik.com",
      whatsapp: "WhatsApp üzerinden bize ulaşabilirsiniz: https://wa.me/902583713050",
      general: "Size yardımcı olmaktan memnuniyet duyarız. Lütfen sorunuzu biraz açar mısınız?"
    };
  
    return map[intent] || map.general;
  }
  