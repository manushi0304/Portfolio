// client/src/components/hero-section.tsx
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Download, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/FlipWords";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

import { FaGithub } from "react-icons/fa";
import {
  SiTailwindcss,
  SiReact,       // React
  SiFigma,
  SiMongodb,
  SiPython,
} from "react-icons/si";

const WORDS = [
  "Frontend Frameworks",
  "Machine Learning",
  "Research",
  "Cybersecurity",
  "UI/UX Designs",
];

export default function HeroSection() {
  // subtle 3D tilt for the center badge
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [30, -30]);
  const rotateY = useTransform(x, [-300, 300], [-30, 30]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - window.innerWidth / 2);
      y.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-visible pt-20 flex items-center justify-center">
      {/* Soft animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 0.8, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className="
          relative z-10 mx-auto max-w-7xl
          grid items-center gap-12 px-6 lg:px-10
          grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]
        "
      >
        {/* Left: heading + copy + CTA */}
        <motion.div
          className="space-y-8 lg:-translate-x-6 xl:-translate-x-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black leading-none tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
            >
              Manushi
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
            >
              Bombaywala
            </motion.span>
          </motion.h1>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xl text-gray-light max-w-lg leading-relaxed">
              I&apos;m a passionate software engineer with an interest in
              <br />
              <FlipWords
                words={WORDS}
                duration={3000}
                className="font-semibold"
                lettersClassName="text-white"
              />
            </p>
          </motion.div>

          {/* Socials */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { href: "https://github.com/manushi0304", label: "GH", name: "GitHub", testId: "link-github" },
              { href: "https://www.linkedin.com/in/manushi-bombaywala/", label: "LN", name: "LinkedIn", testId: "link-linkedin" },
              { href: "mailto:manushibombaywala0304@gmail.com", label: "EM", name: "Mail", testId: "link-mail" },
              { href: "https://leetcode.com/u/manushicode/", label: "LC", name: "LeetCode", testId: "link-leetcode" },
              { href: "https://medium.com/@manushibombaywala0304", label: "MD", name: "Medium", testId: "link-medium" },
            ].map((s, i) => (
              <Tooltip key={s.label} delayDuration={150}>
                <TooltipTrigger asChild>
                  <motion.a
                    href={s.href}
                    aria-label={s.name}
                    className="text-gray-light hover:text-white transition-all duration-300 font-semibold text-lg px-3 py-2 rounded-lg hover:bg-gray-800"
                    data-testid={s.testId}
                    whileHover={{ scale: 1.1, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    {s.label}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-purple-600 text-white border-0 px-2 py-1 rounded-md">
                  <span className="text-xs font-medium">{s.name}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button variant="primary" onClick={scrollToWork}>View My Work</Button>
            <Button asChild variant="outline">
              <a
                href="https://drive.google.com/file/d/13s31xBYr3-xPQKfAYXqIQXBB8KdI8_kM/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: rotating rings + orbiting icons */}
        {/* Right: rotating rings + orbiting icons */}
<motion.div
  className="
    relative ml-auto
    h-[28rem] w-[28rem] md:h-[34rem] md:w-[34rem]
    lg:translate-x-8 xl:translate-x-14
  "
  style={{ perspective: 1000 }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.5, duration: 0.6 }}
>
  {/* Center badge (kept centered even with 3D tilt) */}
  <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
    <motion.div
      className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl"
      style={{ rotateX, rotateY }}
    >
      <span className="text-3xl font-bold text-white">MB</span>
    </motion.div>
  </div>

  {/*
    === Equal spacing setup ===
    Choose radius + duration for each ring.
    baseDeg shifts where the first icon starts (-90 = top).
  */}
  {(() => {
    const INNER_R = 120, INNER_DUR = 22;
    const OUTER_R = 200, OUTER_DUR = 38;
    const baseDeg = -90; // put first icon at the top
    const toBaseDelay = (deg: number, dur: number) =>
      (((deg % 360) + 360) % 360) / 360 * dur;

    const innerIcons = [
      <SiTailwindcss className="h-10 w-10 text-white" />,
      <FaGithub className="h-9 w-9 text-white" />,
    ];

    const outerIcons = [
      <SiReact className="h-9 w-9 text-white" />,
      <SiMongodb className="h-8 w-8 text-white" />,
      <SiFigma className="h-8 w-8 text-white" />,
      <SiPython className="h-8 w-8 text-white" />, // add/remove as you like
    ];

    const innerBase = toBaseDelay(baseDeg, INNER_DUR);
    const outerBase = toBaseDelay(baseDeg, OUTER_DUR);

    return (
      <>
        {/* INNER RING — equally spaced */}
        {innerIcons.map((icon, i) => (
          <OrbitingCircles
            key={`inner-${i}`}
            duration={INNER_DUR}
            radius={INNER_R}
            delay={innerBase + (i * INNER_DUR) / innerIcons.length}
            path={i === 0}        // draw dashed ring only once
            rotatePath
            upright
          >
            {icon}
          </OrbitingCircles>
        ))}

        {/* OUTER RING — equally spaced, reverse direction */}
        {outerIcons.map((icon, i) => (
          <OrbitingCircles
            key={`outer-${i}`}
            duration={OUTER_DUR}
            radius={OUTER_R}
            delay={outerBase + (i * OUTER_DUR) / outerIcons.length}
            path={i === 0}        // draw dashed ring only once
            rotatePath
            upright
            reverse
          >
            {icon}
          </OrbitingCircles>
        ))}
      </>
    );
  })()}
</motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={scrollToWork}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-light hover:text-white transition-colors">
          <span className="text-sm font-medium">Scroll Down</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </motion.div>
    </section>
  );
}
