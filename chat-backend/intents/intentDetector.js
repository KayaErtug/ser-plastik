// chat-backend/intents/intentDetector.js
// Tek intent sözlüğü: sales / product / contact / whatsapp / greeting / general

export function detectIntent(text = "") {
  const t = String(text).toLowerCase();

  // Greeting
  if (
    t.includes("merhaba") ||
    t.includes("selam") ||
    t.includes("iyi günler") ||
    t.includes("iyi akşamlar") ||
    t.includes("günaydın")
  ) {
    return "greeting";
  }

  // WhatsApp / hızlı teklif (kullanıcı özellikle WhatsApp'ı soruyor)
  if (t.includes("whatsapp") || t.includes("wa.me")) {
    return "whatsapp";
  }

  // Contact info
  if (
    t.includes("iletişim") ||
    t.includes("telefon") ||
    t.includes("numara") ||
    t.includes("aradım") ||
    t.includes("adres") ||
    t.includes("mail")
  ) {
    return "contact";
  }

  // Sales signals (fiyat/teklif/termin/sipariş)
  if (
    t.includes("fiyat") ||
    t.includes("teklif") ||
    t.includes("kaç para") ||
    t.includes("fiyatı") ||
    t.includes("termin") ||
    t.includes("kaç günde") ||
    t.includes("kaç gün") ||
    t.includes("sipariş") ||
    t.includes("üretim süresi") ||
    t.includes("minimum") ||
    t.includes("moq") ||
    t.includes("ton") ||
    t.match(/\b\d+\s*(adet|kg|kilo|ton)\b/)
  ) {
    return "sales";
  }

  // Product info
  if (
    t.includes("ürün") ||
    t.includes("poşet") ||
    t.includes("naylon") ||
    t.includes("jelatin") ||
    t.includes("kargo") ||
    t.includes("ambalaj") ||
    t.includes("pazar poşeti") ||
    t.includes("çöp poşeti")
  ) {
    return "product";
  }

  return "general";
}
