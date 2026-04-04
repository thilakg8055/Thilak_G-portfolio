import { motion } from "framer-motion";
import { experiences, education } from "../data/experience";

export default function Experience() {
  return (
    <section id="experience" className="bg-[#050A0E] py-24 px-6 md:px-16 lg:px-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-20"
      >
        <span className="section-num">/ 02</span>
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mt-2">
          WHERE I'VE<br />
          <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}>
            WORKED
          </span>
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Center line (desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px timeline-line" />

        <div className="flex flex-col gap-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`lg:w-[calc(50%-2rem)] ${i % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"}`}
            >
              {/* Dot */}
              <div className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 items-center justify-center ${
                exp.current ? "border-[#00FFB3] bg-[#00FFB3]" : "border-[#00D4FF] bg-[#050A0E]"
              }`}
                style={{ top: `${i * 13 + 2}%` }}
              />

              <div
                className={`relative p-8 border ${
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
              </div>
            </motion.div>
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
