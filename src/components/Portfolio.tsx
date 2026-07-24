import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioProjects, portfolioCategories, ProjectCategory } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { Sparkles, Code2, FolderGit2 } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');

  const filteredProjects = selectedCategory === 'All' 
    ? portfolioProjects 
    : portfolioProjects.filter(p => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-neutral-900/40 relative border-t border-b border-neutral-800/80">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Selected Projects
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Here are some of the websites I have designed.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {portfolioCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/20' 
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Easy Edit Hint Box for Site Owner */}
        <div className="mt-16 max-w-2xl mx-auto p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <FolderGit2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-white font-semibold block">Need to add or edit portfolio projects?</span>
              <span className="text-neutral-400 text-[11px]">All project records are stored in <code className="text-amber-300 font-mono">/src/data/portfolioData.ts</code></span>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-amber-400 text-xs font-semibold shrink-0"
          >
            Request New Website
          </a>
        </div>

      </div>
    </section>
  );
};
