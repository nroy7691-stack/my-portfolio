import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
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
    <div className="group rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] overflow-hidden flex flex-col justify-between hover:bg-[#F8FAFC] hover:border-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
      
      {/* Screenshot Frame / Image Area */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <ProjectScreenshotPlaceholder 
          project={project} 
          className="h-52 w-full" 
          onClickView={handleViewProject}
        />
      </div>

      {/* Project Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          {/* Category Pill Tag */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold">
              <Tag className="w-3 h-3 text-[#2563EB]" />
              {project.category}
            </span>

            {project.featured && (
              <span className="text-[10px] font-mono font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE]">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">
            {project.description}
          </p>

        </div>

        <div className="space-y-4 pt-2">
          
          {/* Technologies Stack Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#E2E8F0] text-[11px] font-mono text-[#2563EB] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* View Project Button */}
          <button
            onClick={handleViewProject}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-md shadow-blue-600/15 group-hover:shadow-blue-600/30"
          >
            <span>View Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
