import { useEffect, useState, Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ContactSection from "@/components/contact-section";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazies
const Cursor = lazy(() => import("@/components/ui/Cursor"));
const FloatingCodeSnippets = lazy(() => import("@/components/FloatingCodeSnippets"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* <Route path="/work" component={FeaturedWork} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [showCursor, setShowCursor] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const [suppressFXByHash, setSuppressFXByHash] = useState(false);
  const [suppressFXByView, setSuppressFXByView] = useState(false);
  const [location] = useLocation();

  // Disable FX on these routes entirely
  const DISABLE_FX_PATHS = ["/work", "/featured-work", "/projects"];
  const fxDisabledOnRoute = DISABLE_FX_PATHS.some((p) => location.startsWith(p));

  // Respect user motion prefs + cursor hover ability
  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      const enableCursor = mqHover.matches && !mqReduce.matches;
      const enableFX = !mqReduce.matches;
      setShowCursor(enableCursor);
      setMotionOK(enableFX);
      document.documentElement.classList.toggle("has-custom-cursor", enableCursor);
      document.documentElement.classList.toggle("fx-enabled", enableFX);
    };
    decide();
    const onChange = () => decide();
    // @ts-ignore cross-browser
    mqHover.addEventListener?.("change", onChange) ?? mqHover.addListener(onChange);
    // @ts-ignore cross-browser
    mqReduce.addEventListener?.("change", onChange) ?? mqReduce.addListener(onChange);
    return () => {
      // @ts-ignore cross-browser
      mqHover.removeEventListener?.("change", onChange) ?? mqHover.removeListener(onChange);
      // @ts-ignore cross-browser
      mqReduce.removeEventListener?.("change", onChange) ?? mqReduce.removeListener(onChange);
      document.documentElement.classList.remove("has-custom-cursor", "fx-enabled");
    };
  }, []);

  // Suppress by hash (#work)
  useEffect(() => {
    const compute = () => setSuppressFXByHash(window.location.hash === "#work");
    compute();
    const onHash = () => compute();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Suppress when #work section is actually on screen
  useEffect(() => {
    const el = document.getElementById("work");
    if (!el || !("IntersectionObserver" in window)) {
      // fallback: basic scroll check
      const check = () => {
        const r = el?.getBoundingClientRect();
        if (!r) return setSuppressFXByView(false);
        const vh = window.innerHeight || 0;
        // Visible if at least ~25% of its height intersects viewport
        const visiblePx = Math.min(vh, r.bottom) - Math.max(0, r.top);
        setSuppressFXByView(visiblePx > 0.25 * Math.min(vh, r.height));
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      return () => {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setSuppressFXByView(e.isIntersecting && e.intersectionRatio >= 0.25);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [location]); // re-run if page component re-mounts

  const showSnippets =
    motionOK && !fxDisabledOnRoute && !suppressFXByHash && !suppressFXByView;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Background FX (behind everything) */}
        {showSnippets && (
          <Suspense fallback={null}>
            <FloatingCodeSnippets />
          </Suspense>
        )}

        {/* App UI */}
        <Toaster />
        <Router />

        {/* Global custom cursor */}
        {showCursor && (
          <Suspense fallback={null}>
            <Cursor />
          </Suspense>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
