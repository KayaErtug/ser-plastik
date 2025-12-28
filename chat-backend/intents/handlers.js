export async function handleIntent(intent, message, aiReply) {
    switch (intent) {
      case "sales":
        return (
          aiReply ||
          "Fiyat ve teklif talepleriniz için ekibimizle iletişime geçmenizi öneririm."
        );
  
      case "product_info":
        return (
          aiReply ||
          "Plastik ve endüstriyel ürün gruplarımız hakkında bilgi verebilirim."
        );
  
      case "general_info":
        return (
          aiReply ||
          "Ser Plastik, endüstriyel plastik çözümleri sunan bir firmadır."
        );
  
      case "redirect_whatsapp":
        return "Hızlı iletişim için WhatsApp hattımız: https://wa.me/905323402036";
  
      case "general_chat":
      default:
        return aiReply || "Size nasıl yardımcı olabilirim?";
    }
  }
  