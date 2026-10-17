import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const products = [
  { image: "Kargo E-Ticaret Ambalajları.png", tr: "Kargo ambalajları", en: "Courier packaging" },
  { image: "industrial-packaging-real.webp", tr: "Endüstriyel ambalaj", en: "Industrial packaging" },
  { image: "transformer-substation.png", tr: "Mıcıraltı naylon örtü", en: "Under-aggregate PE sheet" },
  { image: "Jelatin Şeffaf Ambalaj.png", tr: "Şeffaf ambalaj", en: "Transparent packaging" },
  { image: "Naylon Torbalar  Poşetler.png", tr: "Özel üretim torbalar", en: "Custom plastic bags" },
  { image: "Geri Dönüşüm Ürünleri.png", tr: "Çöp torbaları", en: "Garbage bags" },
];

export default function ProductMarquee() {
  const { language } = useLanguage();
  const tr = language === "tr";
  const [paused, setPaused] = useState(false);
  return (
    <section id="ambalaj-perspektifi" className={`product-marquee-section ${paused ? "is-paused" : ""}`} aria-labelledby="marquee-title">
      <div className="product-marquee-heading">
        <span className="section-kicker">{tr ? "Farklı bir perspektif" : "A different perspective"}</span>
        <h2 id="marquee-title">{tr ? "Her ihtiyaca." : "Every need."}<br /><span>{tr ? "Yeni bir bakış." : "A fresh perspective."}</span></h2>
        <p>{tr ? "Ürününüzü koruyan, markanızı taşıyan ambalaj dünyası." : "A world of packaging that protects your product and carries your brand."}</p>
        <button className="marquee-motion-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play size={15} /> : <Pause size={15} />}
          {tr ? (paused ? "Hareketi sürdür" : "Hareketi duraklat") : (paused ? "Resume motion" : "Pause motion")}
        </button>
      </div>
      <ul className="sr-only">{products.map(p => <li key={p.image}>{p[language]}</li>)}</ul>
      <div className="product-marquee-stage" aria-hidden="true">
        {[0, 1].map(row => <div className={`product-marquee-plane product-marquee-plane-${row}`} key={row}>
          <div className="product-marquee-track">
            {[0, 1].map(copy => <div className="product-marquee-group" key={copy}>
              {(row ? [...products].reverse() : products).map((product, index) => <div className="product-marquee-card" key={product.image}>
                <img src={`/images/${product.image}`} alt="" loading="lazy" decoding="async" />
                <div><span>0{index + 1} / SER ÜRETİM</span><strong>{product[language]}</strong></div>
              </div>)}
            </div>)}
          </div>
        </div>)}
      </div>
      <div className="product-marquee-caption">{tr ? "AMBALAJDA GÜÇ · ÜRETİMDE ESNEKLİK" : "STRONG PACKAGING · FLEXIBLE PRODUCTION"}</div>
    </section>
  );
}
