import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ThreeScene from "./ThreeScene";
import ScrambleText from "./robotics/ScrambleText";

const roles = ["AI ENGINEER", "ML RESEARCHER", "FULL-STACK DEV", "SYSTEMS ARCHITECT"];

// Robot-style typewriter: types a role, holds, deletes, moves to the next.
function useTypewriter(words, enabled) {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const state = useRef({ word: 0, char: 0, deleting: false });

  useEffect(() => {
    if (!enabled) return;
    if (reduce) {
      setText(words[0]);
      return;
    }
    let timer;
    const tick = () => {
      const s = state.current;
      const word = words[s.word];
      s.char += s.deleting ? -1 : 1;
      setText(word.slice(0, s.char));
      let delay = s.deleting ? 35 : 70 + Math.random() * 60;
      if (!s.deleting && s.char === word.length) {
        s.deleting = true;
        delay = 1600;
      } else if (s.deleting && s.char === 0) {
        s.deleting = false;
        s.word = (s.word + 1) % words.length;
        delay = 300;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [enabled, words, reduce]);

  return text;
}

function Telemetry({ telemetryRef }) {
  const [data, setData] = useState(null);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      if (telemetryRef.current) setData({ ...telemetryRef.current });
      setUptime(Date.now() - start);
    }, 90);
    return () => clearInterval(id);
  }, [telemetryRef]);

  const fmt = (v, d = 1) => (v == null ? "--" : (v >= 0 ? "+" : "") + v.toFixed(d));
  const joints = data ? [data.j1, data.j2, data.j3, data.j4] : [0, 0, 0, 0];
  const secs = Math.floor(uptime / 1000);

  return (
    <div className="glass p-4 w-64 font-mono text-[10px] tracking-wider text-white/60 relative">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <span className="text-[#00FFB3]">ARM.UNIT-01</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB3] animate-pulse" />
          LIVE
        </span>
      </div>
      {joints.map((v, i) => (
        <div key={i} className="flex items-center gap-2 mb-1.5">
          <span className="w-5 text-white/40">J{i + 1}</span>
          <div className="flex-1 h-[3px] bg-white/5 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-1/2 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF]"
              style={{
                width: `${Math.min(Math.abs(v) / 180, 1) * 50}%`,
                transform: v < 0 ? "translateX(-100%)" : "none",
              }}
            />
          </div>
          <span className="w-14 text-right text-white/80">{fmt(v)}°</span>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-3 gap-1 text-white/40">
        <span>X {fmt(data?.x, 2)}</span>
        <span>Y {fmt(data?.y, 2)}</span>
        <span>Z {fmt(data?.z, 2)}</span>
      </div>
      <div className="mt-2 flex justify-between text-white/40">
        <span>
          GRIP <span className="text-[#00D4FF]">{data ? Math.round(data.grip * 100) : "--"}%</span>
        </span>
        <span>
          UPTIME <span className="text-[#00FFB3]">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</span>
        </span>
      </div>
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const mask = {
  hidden: { y: "105%" },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ ready = true }) {
  const telemetryRef = useRef(null);
  const role = useTypewriter(roles, ready);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* 3D robotics scene */}
      <ThreeScene style={{ position: "absolute", inset: 0, zIndex: 0 }} telemetryRef={telemetryRef} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A0E]/85 via-[#050A0E]/30 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050A0E] z-0 pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,179,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,179,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Viewport HUD frame */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-4 md:inset-8 z-0 pointer-events-none hidden sm:block"
        aria-hidden
      >
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} className={`absolute w-6 h-6 border-[#00FFB3]/50 ${c}`} />
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        className="relative z-10 px-6 md:px-16 lg:px-24 pt-32 pb-24"
      >
        {/* Status badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#00FFB3]/30 rounded-full mb-8 bg-[#050A0E]/50 backdrop-blur"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
          <ScrambleText
            text="SYSTEM ONLINE · AVAILABLE FOR OPPORTUNITIES"
            trigger={ready}
            delay={200}
            className="font-mono text-xs text-[#00FFB3] tracking-widest"
          />
        </motion.div>

        {/* Name + Title */}
        <div className="overflow-hidden mb-2">
          <motion.h1 variants={mask} className="font-display text-[clamp(4rem,15vw,14rem)] leading-none text-white glitch">
            <ScrambleText text="THILAK.G" trigger={ready} duration={1100} delay={250} />
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            variants={mask}
            className="font-display text-[clamp(4rem,15vw,14rem)] leading-none"
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", color: "transparent" }}
          >
            PORTFOLIO
          </motion.h1>
        </div>

        {/* Role typewriter */}
        <motion.div variants={item} className="flex items-center gap-4 mt-4 mb-8 h-6">
          <div className="w-10 h-px bg-gradient-to-r from-[#00FFB3] to-[#00D4FF]" />
          <span className="font-mono text-sm tracking-widest text-white/40">&gt;_</span>
          <span className="font-mono text-sm tracking-widest gradient-text">{role}</span>
          <span className="caret -ml-3" />
        </motion.div>

        {/* Description */}
        <motion.p variants={item} className="text-white/50 text-lg max-w-xl leading-relaxed mb-12">
          Building production-grade AI systems, scalable web applications,
          and pushing the boundaries of deep learning research.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,255,179,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] text-black font-display text-lg tracking-wider flex items-center gap-3 group"
          >
            <span className="absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 skew-x-[-20deg] translate-x-0 group-hover:translate-x-[500%] transition-transform duration-700" />
            VIEW PROJECTS
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, borderColor: "#00D4FF", color: "#00D4FF" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 border border-white/20 text-white font-display text-lg tracking-wider transition-colors duration-300 bg-[#050A0E]/40 backdrop-blur"
          >
            CONTACT ME
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Live arm telemetry */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={ready ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-10 top-28 z-10 hidden xl:block"
      >
        <Telemetry telemetryRef={telemetryRef} />
      </motion.div>

      {/* Side text */}
      <div
        className="absolute right-8 bottom-32 font-mono text-xs tracking-widest text-white/20 hidden lg:block z-10"
        style={{ writingMode: "vertical-rl" }}
      >
        BASED IN BANGALORE, INDIA • 2026
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-xs tracking-widest text-white/30">SCROLL</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1.5 bg-[#00FFB3] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
