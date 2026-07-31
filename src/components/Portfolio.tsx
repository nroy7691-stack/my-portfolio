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
    <section id="portfolio" className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-b border-[#E2E8F0] overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>My Work</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Selected Projects
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Explore a showcase of modern, responsive websites designed for real businesses to elevate their online presence.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-12">
          {portfolioCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-600/25 scale-102' 
                    : 'bg-[#FFFFFF] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE] border border-[#CBD5E1] font-semibold'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio Owner Helper Box */}
        <div className="mt-16 max-w-2xl mx-auto p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB]/50 shadow-sm hover:shadow-md transition-all duration-300 text-center text-xs text-[#475569] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#0F172A] font-bold text-sm block">Looking for a custom web design?</span>
              <span className="text-[#64748B] text-xs">Let's build a tailored website designed specifically for your brand.</span>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shrink-0 transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            Start Your Project
          </a>
        </div>

      </div>
    </section>
  );
};

