import { motion } from "framer-motion";
import ThreeScene from "./ThreeScene";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
export default function Hero() {
  const roles = ["AI ENGINEER", "ML RESEARCHER", "FULL-STACK DEV", "SYSTEMS ARCHITECT"];


  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2000); // change every 2 sec

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050A0E]">
      {/* 3D Background */}
      <ThreeScene style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050A0E]/30 to-[#050A0E] z-0" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00FFB3]/3 to-transparent z-0" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,179,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,179,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-32">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#00FFB3]/30 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
          <span className="font-mono text-xs text-[#00FFB3] tracking-widest">AVAILABLE FOR OPPORTUNITIES</span>
        </motion.div>

        {/* Name + Title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="font-display text-[clamp(4rem,15vw,14rem)] leading-none text-white"
          >
            THILAK.G
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            className="font-display text-[clamp(4rem,15vw,14rem)] leading-none"
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", color: "transparent" }}
          >
            PORTFOLIO
          </motion.h1>
        </div>

        {/* Role line */}
        {/* <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex items-center gap-4 mt-4 mb-8"
        >
          <div className="w-10 h-px bg-gradient-to-r from-[#00FFB3] to-[#00D4FF]" />
          <span className="font-mono text-sm tracking-widest gradient-text">AI ENGINEER</span>
        </motion.div> */}

        {/* <motion.span
          key={roles[currentRole]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-sm tracking-widest gradient-text"
        >
          {roles[currentRole]}
        </motion.span> */}


        <AnimatePresence mode="wait">
          <motion.span
            key={roles[currentRole]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm tracking-widest gradient-text"
          >
            ---{roles[currentRole]}
          </motion.span>
        </AnimatePresence>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="text-white/50 text-lg max-w-xl leading-relaxed mb-12"
        >
          Building production-grade AI systems, scalable web applications,
          and pushing the boundaries of deep learning research.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex flex-wrap gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,255,179,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] text-black font-display text-lg tracking-wider flex items-center gap-3"
          >
            VIEW PROJECTS
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, borderColor: "#00D4FF", color: "#00D4FF" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 border border-white/20 text-white font-display text-lg tracking-wider transition-colors duration-300"
          >
            CONTACT ME
          </motion.button>
        </motion.div>

        {/* Side text */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 writing-mode-vertical font-mono text-xs tracking-widest text-white/20 hidden lg:block"
          style={{ writingMode: "vertical-rl" }}
        >
          BASED IN BANGALORE, INDIA • 2026
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-10 mb-14 flex gap-4"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-xs tracking-widest text-white/30">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#00FFB3] to-transparent"
        />
      </motion.div>
    </section>
  );
}
