export function detectIntent(text = "") {
    const t = text.toLowerCase();
  
    if (t.includes("fiyat") || t.includes("teklif")) return "sales";
    if (t.includes("ürün")) return "product";
    if (t.includes("iletişim") || t.includes("telefon")) return "contact";
    if (t.includes("whatsapp")) return "whatsapp";
    if (t.includes("merhaba") || t.includes("selam")) return "greeting";
  
    return "general";
  }
  