export function detectIntent(message = "") {
    const text = message.toLowerCase();
  
    if (
      text.includes("fiyat") ||
      text.includes("teklif") ||
      text.includes("kaç para")
    ) {
      return "sales";
    }
  
    if (
      text.includes("ürün") ||
      text.includes("ne satıyorsunuz") ||
      text.includes("ürünleriniz")
    ) {
      return "product_info";
    }
  
    if (
      text.includes("whatsapp") ||
      text.includes("iletişim") ||
      text.includes("numara")
    ) {
      return "redirect_whatsapp";
    }
  
    if (
      text.includes("kimsiniz") ||
      text.includes("hakkınızda") ||
      text.includes("firma")
    ) {
      return "general_info";
    }
  
    return "general_chat";
  }
  