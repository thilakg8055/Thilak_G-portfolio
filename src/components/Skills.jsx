import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "../data/skills";

function SkillBar({ name, level, index, inView }) {
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
        <span className="font-mono text-sm text-[#00FFB3]">{level}%</span>
      </div>
      <div className="h-px bg-white/5 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 h-full"
          style={{
            background: `linear-gradient(90deg, #00FFB3, #00D4FF)`,
            height: "2px",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Glow dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00D4FF]"
          style={{ boxShadow: "0 0 8px #00D4FF" }}
          initial={{ left: 0 }}
          animate={inView ? { left: `${level}%` } : { left: 0 }}
          transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
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
    <section id="skills" ref={ref} className="bg-[#050A0E] py-24 px-6 md:px-16 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <span className="section-num">/ 03</span>
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mt-2">
          EXPERTISE &<br />
          <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}>
            CAPABILITY
          </span>
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
