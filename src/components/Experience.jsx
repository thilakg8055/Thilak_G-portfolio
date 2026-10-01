import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experiences, education } from "../data/experience";
import ScrambleText from "./robotics/ScrambleText";
import HudCorners from "./robotics/HudCorners";

export default function Experience() {
  const timeline = useRef();
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="experience" className="py-24 px-6 md:px-16 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-20"
      >
        <ScrambleText text="/ 02 — MISSION.LOG" className="section-num" />
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mt-2">
          <ScrambleText text="WHERE I'VE" />
          <br />
          <ScrambleText
            text="WORKED"
            delay={250}
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}
          />
        </h2>
      </motion.div>

      {/* Timeline */}
      <div ref={timeline} className="relative">
        {/* Center circuit line (desktop): draws with scroll, data packets flow down it */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 overflow-hidden">
          <motion.div className="absolute inset-0 timeline-line origin-top" style={{ scaleY: progress }} />
          {[0, 1, 2].map((k) => (
            <motion.span
              key={k}
              className="absolute left-0 w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent"
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: k * 1.2, ease: "linear" }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-12">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="relative">
              {/* Node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-30% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="hidden lg:flex absolute left-1/2 top-10 w-4 h-4 border-2 items-center justify-center z-10 border-[#00FFB3] bg-[#050A0E]"
                style={{ x: "-50%", rotate: 45 }}
              >
                <span className={`w-1.5 h-1.5 ${exp.current ? "bg-[#00FFB3] animate-ping" : "bg-[#00D4FF]"}`} />
              </motion.div>

            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`lg:w-[calc(50%-2rem)] ${i % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"}`}
            >
              <div
                className={`relative p-8 border group ${
                  exp.current
                    ? "border-[#00FFB3]/40 bg-gradient-to-br from-[#00FFB3]/10 to-[#00D4FF]/5"
                    : "border-white/10 bg-[#0D1F2D]/60"
                }`}
              >
                {/* Current badge */}
                {exp.current && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                    <span className="font-mono text-xs text-[#00FFB3] tracking-widest">CURRENTLY WORKING</span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-white/40 tracking-widest">{exp.period}</span>
                  <span className="font-display text-4xl text-white/10">{exp.id}</span>
                </div>

                <span className="font-mono text-xs text-white/30 tracking-wider block mb-4">{exp.location}</span>

                <h3 className={`font-display text-2xl md:text-3xl mb-2 ${exp.current ? "text-white" : "text-white"}`}>
                  {exp.role}
                </h3>
                <p className={`font-body font-medium mb-4 ${exp.current ? "text-[#00FFB3]" : "text-[#00D4FF]"}`}>
                  {exp.company}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>
                <HudCorners inset={-1} size={12} color={exp.current ? "#00FFB3" : "#00D4FF"} />
                {/* Connector from card to node */}
                <span
                  className={`hidden lg:block absolute top-12 w-8 h-px bg-gradient-to-r from-[#00FFB3]/60 to-[#00D4FF]/60 ${
                    i % 2 === 0 ? "-right-8" : "-left-8"
                  }`}
                />
              </div>
            </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-3xl gradient-text">EDUCATION</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#00FFB3]/30 to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-8 border border-white/10 bg-[#0D1F2D]/40 relative overflow-hidden group"
            >
              <HudCorners inset={6} size={10} />
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00FFB3] to-[#00D4FF]"
              />
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs text-[#00FFB3] tracking-widest">{edu.period}</span>
                {edu.status && (
                  <span className="px-3 py-1 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] text-black font-mono text-xs font-bold">
                    {edu.status}
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl text-white mb-1">{edu.degree}</h3>
              <p className="text-white/50 italic mb-4">{edu.field}</p>
              <p className="font-mono text-xs text-white/30 tracking-widest">{edu.institution}</p>
              <p className="font-mono text-xs text-white/20 tracking-widest">{edu.location}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
