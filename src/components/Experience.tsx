import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const images = ["industrial-packaging-real.webp", "Kargo E-Ticaret Ambalajları.png", "Jelatin Şeffaf Ambalaj.png", "Naylon Torbalar  Poşetler.png", "factory-real.webp", "Geri Dönüşüm Ürünleri.png"];

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1400, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref} aria-label={String(value)}><span aria-hidden="true">{count}</span></span>;
}

export default function Experience() {
  const { language } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const tr = language === "tr";
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      element.style.setProperty("--journey", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return (
    <section ref={ref} className={`material-journey ${paused ? "motion-paused" : ""}`} aria-label={tr ? "Ambalaj dünyasına yolculuk" : "A journey into packaging"}>
      <div className="journey-stage">
        <div className="journey-grid" />
        <div className="journey-heading">
          <span className="text-xs font-bold uppercase tracking-[.3em] text-cyan-200">SER ÜRETİM / MATERIAL STORIES</span>
          <h2>{tr ? "Her detayda" : "In every detail,"}<br /><span className="text-gradient-premium">{tr ? "üretimin gücü." : "the power of production."}</span></h2>
          <p>{tr ? "Bir fikrin ambalaja dönüştüğü yolculuk." : "The journey from an idea to its packaging."}</p>
        </div>
        <div className="card-tunnel" aria-hidden="true">
          {Array.from({ length: 7 }, (_, depth) => <div className="tunnel-slice" key={depth} style={{ "--slice": depth } as CSSProperties}>
            {(["left", "right", "ceiling", "floor"] as const).map((side, index) => <div className={`tunnel-plane tunnel-${side}`} key={side}>
              <div className="tunnel-poster"><img src={`/images/${images[(depth + index) % images.length]}`} alt="" loading="lazy" /><div className="tunnel-poster-copy"><span>0{(depth + index) % 6 + 1} / SER ÜRETİM</span><strong>{tr ? ["ÜRETİMİN GÜCÜ", "AMBALAJIN GELECEĞİ", "HER DETAYDA KALİTE", "FİKRİNİZİ TAŞIR"][index] : ["POWER OF PRODUCTION", "FUTURE OF PACKAGING", "QUALITY IN EVERY DETAIL", "CARRY YOUR IDEAS"][index]}</strong></div></div>
            </div>)}
          </div>)}
        </div>
        <div className="journey-footer"><span><ArrowDown size={16} /> {tr ? "Üretimi keşfetmek için kaydırın" : "Scroll to explore production"}</span><button onClick={() => setPaused(!paused)} aria-label={tr ? (paused ? "Animasyonu sürdür" : "Animasyonu duraklat") : (paused ? "Resume animation" : "Pause animation")}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></div>
      </div>
      <div className="marquee-3d" aria-hidden="true"><div>{[0, 1].map(i => <span key={i}>{tr ? "ÖZEL ÜRETİM ✦ GÜÇLÜ AMBALAJ ✦ SER ÜRETİM ✦ " : "CUSTOM PRODUCTION ✦ STRONG PACKAGING ✦ SER ÜRETİM ✦ "}</span>)}</div></div>
    </section>
  );
}
