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
    <div className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
      
      {/* Screenshot Frame / Image Area */}
      <div className="p-3 bg-neutral-950/60 border-b border-neutral-800">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
              <Tag className="w-3 h-3" />
              {project.category}
            </span>

            {project.featured && (
              <span className="text-[10px] font-mono font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
            {project.description}
          </p>

        </div>

        <div className="space-y-4 pt-2">
          
          {/* Technologies Stack Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* View Project Button */}
          <button
            onClick={handleViewProject}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all duration-200 shadow-md shadow-amber-500/15 group-hover:shadow-amber-500/30"
          >
            <span>View Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
