import React from 'react';
import { ExternalLink, Tag, Sparkles } from 'lucide-react';
import { Project } from '../data/portfolioData';
import { ProjectScreenshotPlaceholder } from './ProjectScreenshotPlaceholder';

interface Props {
  project: Project;
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const handleViewProject = () => {
    if (project.url && project.url !== '#') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Project "${project.title}" URL is currently set to placeholder '#'. You can easily update the 'url' property in /src/data/portfolioData.ts!`);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between hover:border-[#2563EB]/70 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 h-full">
      
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 left-6 right-6 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300 z-10"></div>

      {/* Screenshot Frame / Image Area */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <ProjectScreenshotPlaceholder 
          project={project} 
          className="h-52 w-full" 
          onClickView={handleViewProject}
        />
      </div>

      {/* Project Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          
          {/* Category Pill Tag & Featured Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold tracking-wide">
              <Tag className="w-3 h-3 text-[#2563EB]" />
              <span>{project.category}</span>
            </span>

            {project.featured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition-colors tracking-tight leading-snug">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#475569] leading-relaxed line-clamp-3 font-normal">
            {project.description}
          </p>

        </div>

        <div className="space-y-4 pt-2">
          
          {/* Technologies Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-mono text-[#334155] font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* View Project Button */}
          <button
            type="button"
            onClick={handleViewProject}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 cursor-pointer"
          >
            <span>View Live Project</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

        </div>

      </div>

    </div>
  );
};

