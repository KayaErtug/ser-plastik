export function fallbackReply(intent) {
    const map = {
      greeting: "Merhaba, ben Mimi. Ser Plastik ürünleri, teklif ve sipariş talepleri konusunda yardımcı olabilirim.",
      product: "Naylon torba, jelatin ambalaj, endüstriyel ve özel üretim ambalaj çözümleri sunuyoruz.",
      sales: "Fiyat ve teklif talepleriniz için satış ekibimiz size yardımcı olacaktır.",
      contact: "Telefon: 0258 371 30 50\nE-posta: info@ser-plastik.com",
      whatsapp: "WhatsApp üzerinden bize ulaşabilirsiniz: https://wa.me/905336667381",
      general: "Ben Mimi. Yalnızca Ser Plastik, plastik ambalaj ürünleri, üretim, teklif ve sipariş konularında yardımcı olabilirim."
    };
  
    return map[intent] || map.general;
  }
  