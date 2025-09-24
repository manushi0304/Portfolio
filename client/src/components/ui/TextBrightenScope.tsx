import { useEffect, useRef } from "react";

/**
 * Wrap any text block with <TextBrightenScope> ... </TextBrightenScope>
 * to make only that block brighten under the cursor.
 * It creates an absolutely-positioned overlay inside the container and
 * tracks the mouse with a smooth lerp.
 */
export default function TextBrightenScope({
  children,
  radius = 120,       // solid bright radius (px)
  feather = 90,       // falloff (px)
  strength = 0.35,    // 0..1 (0.25–0.45 is nice)
}: {
  children: React.ReactNode;
  radius?: number;
  feather?: number;
  strength?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const spot = spotRef.current;
    if (!box || !spot) return;

    // initialize variables
    spot.style.setProperty("--tb-r", `${radius}px`);
    spot.style.setProperty("--tb-f", `${feather}px`);
    spot.style.setProperty("--tb-s", String(strength));
    spot.style.setProperty("--tb-x", `${box.clientWidth / 2}px`);
    spot.style.setProperty("--tb-y", `${box.clientHeight / 2}px`);

    let tx = box.clientWidth / 2, ty = box.clientHeight / 2;
    let cx = tx, cy = ty, raf = 0;
    const LERP = 0.35;

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      spot.style.setProperty("--tb-x", `${cx}px`);
      spot.style.setProperty("--tb-y", `${cy}px`);
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [radius, feather, strength]);

  return (
    <div ref={boxRef} className="tb-scope">
      {children}
      <div ref={spotRef} className="tb-spot" aria-hidden />
    </div>
  );
}
