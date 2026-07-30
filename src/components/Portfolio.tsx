import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioCategories, ProjectCategory, getStoredProjects, Project } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { Sparkles, FolderGit2 } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(getStoredProjects());
    };
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);


  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-b border-[#E2E8F0]">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Selected Projects
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
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
                    ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-600/20' 
                    : 'bg-[#FFFFFF] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] border border-[#E2E8F0]'
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
        <div className="mt-16 max-w-2xl mx-auto p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-center text-xs text-[#475569] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#0F172A] font-semibold block">Need to add or edit portfolio projects?</span>
              <span className="text-[#475569] text-[11px]">All project records are stored in <code className="text-[#2563EB] font-mono bg-[#EFF6FF] px-1 py-0.5 rounded border border-[#E2E8F0]">/src/data/portfolioData.ts</code></span>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
          >
            Request New Website
          </a>
        </div>

      </div>
    </section>
  );
};
