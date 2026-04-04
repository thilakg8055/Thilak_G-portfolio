import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../data/projects";
import ProjectModal from "./ProjectModal";

const marqueeItems = ["COMPUTER VISION", "TRADING BOTS", "FULL-STACK", "MCP ARCHITECTURE", "DEEP LEARNING", "NLP SYSTEMS"];

function MarqueeBar() {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-[#00FFB3] via-[#00D4FF] to-[#0080FF] py-3">
      <div className="flex gap-12 marquee-track whitespace-nowrap">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="font-display text-black text-xl tracking-widest flex items-center gap-6">
            {item}
            <span className="text-black/50">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Work() {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="work" className="bg-[#050A0E] pt-0">
      <MarqueeBar />

      <div className="px-6 md:px-16 lg:px-24 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-num">/ 01</span>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mt-2">
              SELECTED<br />
              <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)", color: "transparent" }}>
                WORKS
              </span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-right leading-relaxed hidden md:block">
            A curated selection of projects demonstrating expertise in{" "}
            <span className="text-[#00FFB3]">AI Architecture</span>,{" "}
            <span className="text-[#00D4FF]">Full-Stack Engineering</span>, and System Design.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative overflow-hidden cursor-pointer group ${
                i === 0 ? "md:col-span-2" : ""
              } ${i === 3 ? "lg:col-span-2" : ""}`}
              style={{ minHeight: "320px" }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelected(project)}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredId === project.id ? 1.08 : 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#050A0E] via-[#050A0E]/60 to-transparent transition-opacity duration-300 ${
                  hoveredId === project.id ? "opacity-90" : "opacity-70"
                }`} />
                {/* Tint overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#00FFB3]/10 to-[#00D4FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
              </div>

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between" style={{ minHeight: "320px" }}>
                <div className="flex justify-between items-start">
                  <span
                    className="px-3 py-1 font-mono text-xs tracking-widest text-black font-bold"
                    style={{ backgroundColor: project.tagColor }}
                  >
                    {project.tag}
                  </span>
                  <motion.div
                    animate={{ opacity: hoveredId === project.id ? 1 : 0, rotate: hoveredId === project.id ? 0 : -45 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 border border-white/40 flex items-center justify-center text-white"
                  >
                    ↗
                  </motion.div>
                </div>

                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2">{project.title}</h3>
                  <motion.div
                    animate={{ opacity: hoveredId === project.id ? 1 : 0, y: hoveredId === project.id ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/60 text-sm mb-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="font-mono text-xs text-[#00FFB3]">{t}</span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
