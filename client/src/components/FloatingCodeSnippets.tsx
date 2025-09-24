"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Snip = {
  id: number;
  x: number; // vw
  y: number; // vh
  text: string;
  visibleChars: number;
  maxChars: number;
  createdAt: number;
  lifespan: number; // ms
  fontSize: number; // rem
  rotate: number; // deg
  opacity: number; // 0-1
  hue: number; // 0-360 for subtle color tint
};

const CODE_BANK = [
  `const sum = (a: number, b: number): number => a + b;`,
  `function predict(x: number): number { return model(x); }`,
  `interface User { name: string; score: number; }`,
  `const query = "SELECT name, score FROM users LIMIT 5";`,
  `type LoginData = { u: string };`,
  `fetch('/api/login', { method: 'POST', body: JSON.stringify({ u: 'me' }) });`,
  `function main(): void { console.log("hello, world"); }`,
  `class Node { constructor(private v: any) {} }`,
  `for (let i: number = 0; i < n; i++) { dp[i] = Math.max(...arr); }`,
  `type Package = string[];`,
  `const packages: Package = ['black', 'ruff', 'mypy'];`,
  `npm install -U black ruff mypy;`,
  `git add -A && git commit -m "feat: ui refinement";`,
  `async function getData(): Promise<Response> { return await fetch('/api/data'); }`,
  `npx create-next-app@latest --ts`,
  `kubectl get pods -n prod --type string`,
  `type History = { loss: number[] };`,
  `plt.plot(new History().loss);`,
  `ssh -i ~/.ssh/id_ed25519 user@server`,
];

const MIN_INTERVAL = 2000; // Slower spawn for fewer snippets
const MAX_INTERVAL = 3500;
const MAX_SNIPPETS = 5; // Reduced for less clutter
const TYPE_SPEED = 80; // ms per character - slower for more visible typing
const MIN_DIST = 15; // Minimum distance between snippets

type Rect = { x1: number; y1: number; x2: number; y2: number };

// Protected zones - only protect the essential UI elements
const DESKTOP_ZONES: Rect[] = [
  { x1: 15, y1: 15, x2: 65, y2: 45 }, // Name area - reduced size
  { x1: 25, y1: 65, x2: 55, y2: 75 }, // Buttons area - reduced size
  { x1: 45, y1: 25, x2: 75, y2: 65 }, // Central orbit area - reduced
];

const MOBILE_ZONES: Rect[] = [
  { x1: 10, y1: 15, x2: 90, y2: 50 }, // Name and central area
  { x1: 25, y1: 65, x2: 75, y2: 80 }, // Buttons area
];

// Grid-based spawn system for better distribution
function createSpawnGrid(isMobile: boolean) {
  const zones = isMobile ? MOBILE_ZONES : DESKTOP_ZONES;
  const gridSize = isMobile ? 8 : 12;
  const cellWidth = 100 / gridSize;
  const cellHeight = 100 / gridSize;
  
  const availableCells: { x: number; y: number }[] = [];
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      
      // Check if this cell center is in a protected zone
      const inProtectedZone = zones.some(zone => 
        x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2
      );
      
      if (!inProtectedZone) {
        availableCells.push({ x, y });
      }
    }
  }
  
  return availableCells;
}

function inRect(x: number, y: number, r: Rect) {
  return x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2;
}

function inAnyZone(x: number, y: number, zones: Rect[]) {
  return zones.some(z => inRect(x, y, z));
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function tooClose(x: number, y: number, snips: Snip[], minDist: number) {
  return snips.some(s => distance(x, y, s.x, s.y) < minDist);
}

export default function FloatingCodeSnippets() {
  const [snips, setSnips] = useState<Snip[]>([]);
  const idRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const usedCells = useRef(new Set<string>());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    const handler = () => update();
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const ZONES = isMobile ? MOBILE_ZONES : DESKTOP_ZONES;
  const availableCells = useMemo(() => createSpawnGrid(isMobile), [isMobile]);

  // Spawn snippets with better distribution
  useEffect(() => {
    let mounted = true;

    const spawn = () => {
      if (!mounted) return;

      setSnips((prev) => {
        if (prev.length >= MAX_SNIPPETS) return prev;

        // Try to find a good position
        let x = 50, y = 50, tries = 0;
        let foundGoodSpot = false;

        // First try grid-based approach for better distribution
        const shuffledCells = [...availableCells].sort(() => Math.random() - 0.5);
        
        for (const cell of shuffledCells) {
          const cellKey = `${Math.floor(cell.x / 10)}-${Math.floor(cell.y / 10)}`;
          if (usedCells.current.has(cellKey)) continue;
          
          // Add some randomness within the cell
          const cellX = cell.x + rand(-5, 5);
          const cellY = cell.y + rand(-5, 5);
          
          if (!tooClose(cellX, cellY, prev, MIN_DIST) && 
              !inAnyZone(cellX, cellY, ZONES)) {
            x = cellX;
            y = cellY;
            usedCells.current.add(cellKey);
            foundGoodSpot = true;
            break;
          }
        }

        // Fallback to random positioning if grid fails
        if (!foundGoodSpot) {
          while (tries < 100) {
            x = rand(5, 95);
            y = rand(5, 95);
            if (!inAnyZone(x, y, ZONES) && !tooClose(x, y, prev, MIN_DIST)) {
              foundGoodSpot = true;
              break;
            }
            tries++;
          }
        }

        if (!foundGoodSpot) return prev;

        const id = ++idRef.current;
        const text = pick(CODE_BANK);
        const snip: Snip = {
          id,
          x,
          y,
          text,
          visibleChars: 0,
          maxChars: text.length,
          createdAt: performance.now(),
          lifespan: Math.floor(rand(10000, 15000)), // Longer lifespan
          fontSize: rand(0.7, 0.95),
          rotate: rand(-3, 3),
          opacity: rand(0.6, 0.8),
          hue: rand(180, 280),
        };
        return [...prev, snip];
      });

      setTimeout(spawn, Math.floor(rand(MIN_INTERVAL, MAX_INTERVAL)));
    };

    const t = setTimeout(spawn, Math.floor(rand(500, 1000)));
    return () => clearTimeout(t);
  }, [ZONES, availableCells]);

  // Clean up used cells when snippets disappear
  useEffect(() => {
    const cleanup = setInterval(() => {
      if (snips.length < MAX_SNIPPETS / 2) {
        usedCells.current.clear();
      }
    }, 5000);
    return () => clearInterval(cleanup);
  }, [snips.length]);

  // Type and lifetime management
  useEffect(() => {
    const tick = () => {
      setSnips((prev) => {
        let changed = false;
        const now = performance.now();
        
        const next = prev
          .map((s) => {
            const age = now - s.createdAt;
            const alive = age < s.lifespan;
            
            // Typing logic - type one character every TYPE_SPEED ms
            const shouldType = Math.floor(age / TYPE_SPEED);
            const visibleChars = Math.min(shouldType, s.maxChars);
            
            if (visibleChars !== s.visibleChars || !alive) changed = true;
            return { ...s, visibleChars, _age: age } as any;
          })
          .filter((s: any) => s._age < s.lifespan && !inAnyZone(s.x, s.y, ZONES));

        return changed ? next.map(({ _age, ...r }: any) => r) : prev;
      });
    };

    // Run tick every 16ms for smooth animation
    const interval = setInterval(tick, 16);
    return () => clearInterval(interval);
  }, [ZONES]);

  // Dynamic drift with oscillation
  const drift = useMemo(() => new Map<number, { dx: number; dy: number; phase: number }>(), []);

  return (
    <div
      aria-hidden
      className="
        pointer-events-none fixed inset-0 z-0
        [mask-image:radial-gradient(90%_80%_at_50%_50%,black_0%,black_70%,transparent_100%)]
      "
    >
      <AnimatePresence>
        {snips.map((s) => {
          if (!drift.has(s.id)) {
            drift.set(s.id, {
              dx: rand(-0.3, 0.3),
              dy: rand(-0.3, 0.3),
              phase: rand(0, 2 * Math.PI),
            });
          }
          const d = drift.get(s.id)!;

          const age = (performance.now() - s.createdAt) / s.lifespan;
          const fadeIn = Math.min(1, age / 0.2);
          const fadeOut = Math.min(1, (1 - age) / 0.25);
          const alpha = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut))) * s.opacity;

          const oscillate = Math.sin(performance.now() / 2000 + d.phase) * 2;
          const typed = s.text.slice(0, s.visibleChars);
          const blink = s.visibleChars < s.maxChars && Math.floor(performance.now() / 500) % 2 === 0;

          return (
            <motion.span
              key={s.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: alpha, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                damping: 20, 
                duration: 0.8 
              }}
              className="
                absolute font-mono text-sm whitespace-pre-wrap
                text-white/70 hover:text-white/90 transition-colors duration-300
              "
              style={{
                left: `${s.x + oscillate * d.dx}vw`,
                top: `${s.y + oscillate * d.dy}vh`,
                transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
                fontSize: `${s.fontSize}rem`,
                color: `hsl(${s.hue}, 30%, 85%)`,
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))',
              }}
            >
              {typed}
              {blink ? (
                <span 
                  className="inline-block w-[0.5ch] h-[1em] ml-[1px] animate-pulse"
                  style={{
                    backgroundColor: `hsl(${s.hue}, 50%, 90%)`,
                  }}
                />
              ) : null}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}