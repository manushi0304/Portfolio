"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number; // seconds
  delay?: number;    // seconds
  radius?: number;   // px
  path?: boolean;
  rotatePath?: boolean; // rotate dashed ring too
  upright?: boolean;    // keep icon upright while orbiting
};

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 0,
  radius = 100,
  path = true,
  rotatePath = true,
  upright = true,
}: Props) {
  const vars = {
    "--duration": `${duration}s`,
    "--delay": `${-Math.abs(delay)}s`,
    "--radius": `${radius}px`,
  } as React.CSSProperties;

  return (
    <div className="absolute inset-0" style={vars}>
      {/* Dashed ring */}
      {path && (
        <svg
          className={cn(
            "absolute inset-0 h-full w-full pointer-events-none orbit-origin",
            rotatePath && "orbit-anim",
            reverse && "orbit-reverse"
          )}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.25)"  // visible on dark
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>
      )}

      {/* Rotating layer */}
      <div
        className={cn(
          "absolute inset-0 orbit-origin orbit-anim",
          reverse && "orbit-reverse",
          className
        )}
        style={vars}
      >
        {/* Place the icon by its CENTER on the ring */}
        <div className="orbit-object">
          <div className={upright ? "orbit-counter" : undefined} style={vars}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
