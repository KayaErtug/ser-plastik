import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function ImageLightbox({ image, title, close, closeLabel }: { image: string; title: string; close: () => void; closeLabel: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} className="image-lightbox" aria-label={title} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="lightbox-content"><button autoFocus onClick={close} aria-label={closeLabel}><X /></button><img src={image} alt={title} /><p>{title}</p></div></dialog>;
}
