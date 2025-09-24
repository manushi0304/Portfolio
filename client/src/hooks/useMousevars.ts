import { useEffect } from "react";

/**
 * Updates CSS custom properties (`--x`, `--y`, `--ang`, `--sx`, `--sy`)
 * to drive a smooth, stretchy cursor blob.
 */
export default function useMouseVars() {
  useEffect(() => {
    const root = document.documentElement;

    // Target position (real mouse) and current blob position
    let tx = innerWidth / 2, ty = innerHeight / 2;
    let cx = tx,             cy = ty;

    // Previous frame position for velocity/direction
    let px = cx, py = cy, vx = 0, vy = 0;

    // How quickly the blob catches up (0.5–0.6 = snappy, 0.2 = floaty)
    const LERP = 0.55;

    let raf = 0;

    // Called on every pointer move; update target
    const onMove = (e: PointerEvent) => {
      // Always update – even on “coarse” devices (touch laptops)
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // When page becomes visible again, reset to avoid jumps
    const onVisibility = () => {
      if (!document.hidden) {
        cx = tx; cy = ty; px = cx; py = cy;
        write(cx, cy, 0, 1, 1);
      }
    };

    // Writes CSS custom properties on the root element
    function write(x: number, y: number, ang: number, sx: number, sy: number) {
      root.style.setProperty("--x", `${x}px`);
      root.style.setProperty("--y", `${y}px`);
      root.style.setProperty("--ang", `${ang}rad`);
      root.style.setProperty("--sx", sx.toFixed(3));
      root.style.setProperty("--sy", sy.toFixed(3));
    }

    function tick() {
      // LERP towards the target
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;

      // Compute velocity since last frame
      vx = cx - px; vy = cy - py;
      px = cx; py = cy;

      // Use velocity for rotation (angle) and scale (stretch/squash)
      const ang   = Math.atan2(vy, vx);
      const speed = Math.min(Math.hypot(vx, vy) / 14, 1); // smaller divisor = more stretch
      const stretch = 1 + speed * 0.55; // how much the blob elongates
      const squash  = 1 - speed * 0.25; // how much it narrows

      write(cx, cy, ang, stretch, squash);

      // Continue animating while far from target
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    // Initialize at centre
    write(cx, cy, 0, 1, 1);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}
