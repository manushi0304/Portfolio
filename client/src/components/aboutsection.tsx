import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code, Palette, Zap, ArrowDown, BrainIcon } from "lucide-react";
import { FaRobot } from "react-icons/fa";
const SCROLL_SPEED = 1.8; 
gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    icon: Code,
    title: "Tech Stack",
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "Cpp", level: 80 },
      { name: "Python", level: 70 },
      { name: "NoSQL", level: 50 },
      { name: "TypeScript", level: 50 },
      { name: "HTML5/CSS", level: 80 },
      { name: "Git/GitHub", level: 75 },
    ],
  },
  {
    icon: BrainIcon,
    title: "AIML",
    color: "from-red-500 to-orange-500",
    skills: [
      { name: "Scikit-learn", level: 80 },
      { name: "Numpy", level: 70 },
      { name: "Tensorflow", level: 50 },
      { name: "CNN", level: 50 },
      { name: "Keras", level: 80 },
    ],
  },
  {
    icon: Palette,
    title: "UI Libraries",
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "Tailwind CSS", level: 75 },
      { name: "Material UI", level: 60 },
      { name: "Framer Motion", level: 60 },
      { name: "GSAP", level: 70 },
      { name: "Bootstrap", level: 80 },
    ],
  },
  {
    icon: Zap,
    title: "Design Tools",
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "Figma", level: 90 },
      { name: "Framer", level: 85 },
      { name: "UX Research", level: 85 },
      { name: "Prototyping", level: 88 },
    ],
  },
];

const LEFT_TEXTS = [
  `“ I am a Computer Science undergraduate with practical experience in front-end development, cybersecurity, and machine learning, building responsive interfaces, cloud applications, and production ML models with strengths in collaboration, clear communication, problem solving, and adaptability ”`,
  `Whether I'm designing a sleek user interface or coding a complex application, I'm always striving to create something unique and innovative. I love experimenting with new technologies and staying up-to-date with the latest trends in the tech world.`,
  `Beyond my work as a frontend developer, I'm an active member in tech communities on campus. As a member of the IEEE Computer Society, I've led workshops and mentored other students.`,
  `When I'm not coding, you can find me binge-watching anime, hanging out with friends, watching vlogs, or discovering new music in my favorite genres like RnB, UK Drill, and Chill Rap.`,
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const active = skillCategories[activeIdx];
  const ActiveIcon = active.icon;

  useLayoutEffect(() => {
    const pinEl = pinWrapRef.current;
    const leftEl = leftRef.current;
    if (!pinEl || !leftEl) return;

    const paras = Array.from(
      leftEl.querySelectorAll("p[data-split]")
    ) as HTMLParagraphElement[];

    const originals: string[] = [];
    const chars: HTMLElement[] = [];

    // ✅ allow normal spaces so lines can wrap; no NBSP
    paras.forEach((p) => {
      const original = p.innerHTML;
      originals.push(original);

      const text = p.textContent ?? "";
      const frag = document.createDocumentFragment();

      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch; // <- normal space preserved, so wrapping works
        // make sure spans don't force no-wrap
        span.style.display = "inline";
        frag.appendChild(span);
      }

      p.innerHTML = "";
      p.appendChild(frag);
      chars.push(...Array.from(p.querySelectorAll(".char") as NodeListOf<HTMLElement>));
    });

    gsap.set(chars, { color: "rgba(148,163,184,0.7)", filter: "blur(1px)" });

    const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: pinEl,
    start: "top top",
    end: () => {
      const base = Math.max(window.innerHeight * 2, chars.length * 18);
      return `+=${base / SCROLL_SPEED}`;   // <-- shorter distance => faster
    },
    scrub: 0.4,   // was 0.75; smaller = snappier response (optional)
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: chars.length > 1 ? 1 / (chars.length - 1) : undefined,
  },
});


    tl.to(chars, { color: "#ffffffff", filter: "blur(0px)", yPercent: -1, stagger: 0.010}, 0);

    stRef.current = tl.scrollTrigger!;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stRef.current = null;
      tl.scrollTrigger?.kill();
      tl.kill();
      paras.forEach((p, i) => (p.innerHTML = originals[i]));
    };
  }, []);

  const skipToNext = () => {
    const current = sectionRef.current;
    const next = current?.nextElementSibling as HTMLElement | null;
    const targetY = next?.offsetTop ?? stRef.current?.end ?? window.scrollY;
    window.scrollTo({ top: targetY + 1, behavior: "smooth" });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-gradient-to-b from-dark-secondary to-dark relative overflow-hidden"
    >
      {/* pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, #ffffff 2px, #ffffff 4px)",
          }}
        />
      </div>

      {/* fixed container so columns line up */}
      <div className="mx-auto px-6 relative z-10 max-w-[1200px]">
        <div ref={pinWrapRef} className="min-h-screen flex flex-col pt-10">
          {/* centered title */}
          <div className="mb-10 text-center">
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="gradient-text">I MAKE BRANDS BEAUTIFUL,</span>
              <br />
              <span className="text-white">WEBSITES POWERFUL</span>
              <br />
              <span className="text-gray-light">AND CONTENT CAPTIVATING.</span>
            </motion.h2>
          </div>

          {/* two columns */}
          <div className="grid lg:grid-cols-12 gap-x-16 gap-y-10 items-start">
            {/* LEFT — paragraphs (kept tight width, wrapping ON) */}
            <div className="lg:col-span-6">
              <div
                ref={leftRef}
                className="w-full max-w-[560px] text-left"
              >
                {LEFT_TEXTS.map((t, i) => (
                  <p
                    key={i}
                    data-split
                    className="mb-6 text-[20px] md:text-xl font-light text-gray-300 leading-relaxed break-words whitespace-normal"
                  >
                    {t}
                  </p>
                ))}

                {/* skip arrow */}
                <button
                  onClick={skipToNext}
                  aria-label="Skip to next section"
                  className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full border border-cyan-500/60 text-cyan-400 hover:text-white hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  title="Next section"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT — tech stack */}
            <div className="lg:col-span-6">
              <div className="w-full max-w-[560px]">
                {/* tabs */}
                <div className="flex flex-wrap gap-2 mb-6 justify-start lg:justify-end">
                  {skillCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <motion.button
                        key={category.title}
                        onClick={() => setActiveIdx(index)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          activeIdx === index
                            ? "bg-gradient-to-r " + category.color + " text-white shadow-lg"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm">{category.title}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* active category */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-2 flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${active.color}`}>
                      <ActiveIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>{active.title}</span>
                  </h3>

                  <div className="space-y-4">
                    {active.skills.map((skill) => (
                      <div key={skill.name} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${active.color} rounded-full`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>{/* /grid */}
        </div>{/* /pin wrapper */}
      </div>
    </section>
  );
}
