"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Props = {
  words: string[];
  /** How long each word stays, in ms (default 2000) */
  duration?: number;
  /** Optional classes for the wrapper (positioning, font-weight, etc.) */
  className?: string;
  /** Classes applied to EACH LETTER (put gradient/text color here) */
  lettersClassName?: string;
};

/**
 * Letter-by-letter flip/fade with fixed width (prevents layout shift).
 * IMPORTANT: Put gradient/text color on `lettersClassName`, not the wrapper.
 */
export function FlipWords({
  words,
  duration = 2000,
  className = "",
  lettersClassName = "",
}: Props) {
  if (!words?.length) return null;

  const [i, setI] = useState(0);
  const minCh = useMemo(() => Math.max(...words.map(w => w.length)), [words]);
  const current = words[i];

  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [duration, words.length]);

  return (
    <span
      className={`relative inline-block align-baseline ${className}`}
      style={{ minWidth: `${minCh}ch` }}
      aria-live="polite"
    >
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: 1.8,
            position: "absolute",
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="relative z-10 inline-block"
        >
          {current.split("").map((ch, idx) => (
            <motion.span
              key={`${current}-${idx}`}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`inline-block ${lettersClassName}`}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </span>
  );
}
