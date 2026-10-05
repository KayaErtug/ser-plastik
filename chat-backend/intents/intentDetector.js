export function detectIntent(text = "") {
  const t = String(text).toLowerCase();

  const greetingPatterns = [
    /(^|\s)merhaba($|\s|[!,.?])/,
    /(^|\s)selam($|\s|[!,.?])/,
    /iyi günler/,
    /iyi akşamlar/,
    /günaydın/,
    /(^|\s)hello($|\s|[!,.?])/,
    /(^|\s)hi($|\s|[!,.?])/,
    /good morning/,
    /good afternoon/,
    /good evening/,
  ];

  if (greetingPatterns.some((pattern) => pattern.test(t))) {
    return "greeting";
  }

  if (
    ["site", "web sitesi", "website", "ser-plastik.com", "ser plastik sitesi", "bu site", "this site"].some((term) =>
      t.includes(term)
    )
  ) {
    return "website";
  }

  if (t.includes("whatsapp") || t.includes("wa.me")) {
    return "whatsapp";
  }

  if (
    ["iletişim", "telefon", "numara", "aradım", "adres", "mail", "contact", "phone", "number", "address", "email", "e-mail"].some((term) =>
      t.includes(term)
    )
  ) {
    return "contact";
  }

  if (
    [
      "fiyat",
      "teklif",
      "kaç para",
      "fiyatı",
      "termin",
      "kaç günde",
      "kaç gün",
      "sipariş",
      "üretim süresi",
      "minimum",
      "moq",
      "ton",
      "price",
      "quote",
      "quotation",
      "offer",
      "order",
      "purchase",
      "lead time",
      "delivery time",
      "minimum order",
      "quantity",
      "pieces",
      "pcs",
    ].some((term) => t.includes(term)) ||
    t.match(/\b\d+\s*(adet|kg|kilo|ton|pcs|pieces|units)\b/)
  ) {
    return "sales";
  }

  if (
    [
      "ürün",
      "poşet",
      "naylon",
      "jelatin",
      "kargo",
      "ambalaj",
      "pazar poşeti",
      "çöp poşeti",
      "product",
      "bag",
      "plastic bag",
      "packaging",
      "courier",
      "mailer",
      "transparent",
      "industrial",
      "garbage bag",
      "trash bag",
    ].some((term) => t.includes(term))
  ) {
    return "product";
  }

  return "general";
}
