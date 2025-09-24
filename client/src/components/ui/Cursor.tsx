import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function Cursor() {
  if (typeof document === "undefined") return null;
  return createPortal(<CursorInner />, document.body);
}

function CursorInner() {
  const el = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo>>();
  const yTo = useRef<ReturnType<typeof gsap.quickTo>>();

  useEffect(() => {
    const node = el.current!;
    gsap.set(node, { xPercent: -50, yPercent: -50, scale: 1 });

    xTo.current = gsap.quickTo(node, "x", { duration: 0.16, ease: "power3.out" });
    yTo.current = gsap.quickTo(node, "y", { duration: 0.16, ease: "power3.out" });

    let lastX = innerWidth / 2;
    let lastY = innerHeight / 2;
    let lastT = performance.now();

    // Defaults
    const DEFAULT_INTERACTIVE = "#60a5fa";
    const BASE_COLOR   = "#ffffff";
    const BASE_BLEND   = "difference";
    const BASE_OPACITY = 0.9;

    // Text darken settings
    const TEXT_DARKEN_COLOR   = "#000000";
    const TEXT_DARKEN_BLEND   = "multiply";
    const TEXT_DARKEN_OPACITY = 0.28;

    // Apply directly to #cursor (inline beats any CSS)
    const setColor   = (c: string) => node.style.setProperty("--cursor-color", c);
    const setBlend   = (m: string) => (node.style.mixBlendMode = m as any);
    const setOpacity = (o: number) => (node.style.opacity = String(Math.max(0, Math.min(1, o))));

    const isTexty = (el: Element | null) =>
      !!el?.closest(
        "[data-cursor-darken],p,span,li,small,strong,em,code,pre,blockquote," +
        "h1,h2,h3,h4,h5,h6"
      );

    const resolveHoverStyle = (el: Element | null) => {
      const t = el?.closest(
        "[data-cursor-color],[data-cursor-blend],[data-cursor-opacity],a,button,[role='button'],[data-cursor-darken]"
      ) as HTMLElement | null;

      if (!t) { setColor(BASE_COLOR); setBlend(BASE_BLEND); setOpacity(BASE_OPACITY); return; }

      // Explicit overrides win
      const explicitColor = t.dataset.cursorColor?.trim();
      const explicitBlend = t.dataset.cursorBlend?.trim();
      const explicitOpStr = t.dataset.cursorOpacity?.trim();
      const explicitOp    = explicitOpStr !== undefined ? parseFloat(explicitOpStr) : undefined;
      const hasExplicit   = !!(explicitColor || explicitBlend || explicitOpStr);

      if (hasExplicit) {
        setColor(explicitColor || BASE_COLOR);
        setBlend(explicitBlend || BASE_BLEND);
        setOpacity(Number.isFinite(explicitOp!) ? explicitOp! : BASE_OPACITY);
        return;
      }

      // Text darken if looks like text / inside data-cursor-darken
      if (isTexty(t)) {
        setColor(TEXT_DARKEN_COLOR);
        setBlend(TEXT_DARKEN_BLEND);
        setOpacity(TEXT_DARKEN_OPACITY);
        return;
      }

      // Interactive default
      const isInteractive = ["A", "BUTTON"].includes(t.tagName) || t.getAttribute("role") === "button";
      if (isInteractive) {
        setColor(DEFAULT_INTERACTIVE);
        setBlend(BASE_BLEND);
        setOpacity(BASE_OPACITY);
      } else {
        setColor(BASE_COLOR);
        setBlend(BASE_BLEND);
        setOpacity(BASE_OPACITY);
      }
    };

    const onMove = (e: PointerEvent) => {
      const t = performance.now();
      const dt = Math.max(16, t - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.min(Math.hypot(dx, dy) / dt, 2);

      const s = 1 + speed * 0.08;
      gsap.to(node, { scale: s, duration: 0.12, overwrite: "auto", ease: "power2.out" });
      gsap.to(node, { scale: 1, duration: 0.35, delay: 0.02, overwrite: "auto", ease: "power3.out" });

      xTo.current!(e.clientX);
      yTo.current!(e.clientY);

      resolveHoverStyle(document.elementFromPoint(e.clientX, e.clientY));

      lastX = e.clientX; lastY = e.clientY; lastT = t;
    };

    // Initialize defaults
    setColor(BASE_COLOR); setBlend(BASE_BLEND); setOpacity(BASE_OPACITY);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div id="cursor" ref={el} aria-hidden>
      <svg className="blob" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="blobFill" cx="0.45" cy="0.40" r="0.6">
            <stop offset="0"   style={{ stopColor: "var(--cursor-color)", stopOpacity: 1 }} />
            <stop offset="0.70" style={{ stopColor: "var(--cursor-color)", stopOpacity: 0.90 }} />
            <stop offset="1"   style={{ stopColor: "var(--cursor-color)", stopOpacity: 0.55 }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill="url(#blobFill)" />
      </svg>
    </div>
  );
}
