import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "../data/skills";
import ScrambleText from "./robotics/ScrambleText";

const SEGMENTS = 24;

function Counter({ value, run, delay }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    let raf;
    let start;
    const timer = setTimeout(() => {
      const step = (now) => {
        start ??= now;
        const p = Math.min((now - start) / 1100, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay * 1000);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, run, delay]);
  return <>{String(n).padStart(2, "0")}</>;
}

function SkillBar({ name, level, index, inView }) {
  const lit = Math.round((level / 100) * SEGMENTS);
  const delay = index * 0.08 + 0.2;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/30">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-xl text-white tracking-wider">{name}</span>
        </div>
        <span className="font-mono text-sm text-[#00FFB3]">
          <Counter value={level} run={inView} delay={delay} />%
        </span>
      </div>
      {/* Segmented diagnostic meter */}
      <div className="flex gap-[3px]">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 flex-1"
            initial={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            animate={
              inView && i < lit
                ? {
                    backgroundColor: i === lit - 1 ? "#ffffff" : i / SEGMENTS > 0.6 ? "#00D4FF" : "#00FFB3",
                    boxShadow: i === lit - 1 ? "0 0 8px #00FFB3" : "0 0 0px transparent",
                  }
                : { backgroundColor: "rgba(255,255,255,0.05)", boxShadow: "0 0 0px transparent" }
            }
            transition={{ duration: 0.15, delay: delay + i * 0.035 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Radar({ skills }) {
  // Plot each skill as a blip: angle by index, distance by proficiency.
  return (
    <div className="relative aspect-square w-full max-w-[260px] mt-6 hidden lg:block" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-[#00FFB3]/20" />
      <div className="absolute inset-[18%] rounded-full border border-[#00FFB3]/15" />
      <div className="absolute inset-[36%] rounded-full border border-[#00FFB3]/10" />
      <div className="absolute left-1/2 inset-y-0 w-px bg-[#00FFB3]/10" />
      <div className="absolute top-1/2 inset-x-0 h-px bg-[#00FFB3]/10" />
      <div className="absolute inset-0 rounded-full radar-sweep" />
      {skills.map((sk, i) => {
        const a = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
        const r = (sk.level / 100) * 46;
        return (
          <motion.span
            key={sk.name}
            className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#00FFB3]"
            style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%`, boxShadow: "0 0 8px #00FFB3" }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.6, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.1, opacity: { duration: 2, repeat: Infinity } }}
          />
        );
      })}
      <span className="absolute -bottom-6 left-0 font-mono text-[10px] tracking-widest text-white/30">SKILL.SCAN // ACTIVE</span>
    </div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("languages");
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const active = skillCategories.find((c) => c.id === activeCategory);

  return (
    <section id="skills" ref={ref} className="py-24 px-6 md:px-16 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <ScrambleText text="/ 03 — SYSTEM.DIAGNOSTICS" className="section-num" />
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mt-2">
          <ScrambleText text="EXPERTISE &" />
          <br />
          <ScrambleText
            text="CAPABILITY"
            delay={250}
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}
          />
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-12">
        {/* Categories */}
        <div className="flex flex-row lg:flex-col gap-3 flex-wrap">
          {skillCategories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                setActiveCategory(cat.id);
                setInView(false);
                setTimeout(() => setInView(true), 50);
              }}
              className={`flex items-center gap-4 p-5 border text-left transition-all duration-300 group ${
                activeCategory === cat.id
                  ? "border-[#00FFB3]/50 bg-gradient-to-br from-[#00FFB3]/10 to-[#00D4FF]/5"
                  : "border-white/10 hover:border-white/20 bg-[#0D1F2D]/40"
              }`}
            >
              <span
                className={`font-mono text-xl transition-colors duration-300 ${
                  activeCategory === cat.id ? "text-[#00FFB3]" : "text-white/30 group-hover:text-white/50"
                }`}
              >
                {cat.icon}
              </span>
              <div>
                <span
                  className={`font-mono text-xs tracking-widest block transition-colors duration-300 ${
                    activeCategory === cat.id ? "text-white" : "text-white/50"
                  }`}
                >
                  {cat.label}
                </span>
                {activeCategory === cat.id && (
                  <div className="h-px w-full bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] mt-2" />
                )}
              </div>
            </motion.button>
          ))}
          <Radar key={activeCategory} skills={active?.skills ?? []} />
        </div>

        {/* Skills */}
        <div>
          {active?.skills.map((skill, i) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
