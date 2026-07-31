import React from 'react';
import { ExternalLink, Globe, Sparkles, Lock } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface Props {
  project: Project;
  className?: string;
  onClickView?: () => void;
}

export const ProjectScreenshotPlaceholder: React.FC<Props> = ({ 
  project, 
  className = '',
  onClickView
}) => {
  const isPlaceholder = !project.image || project.image.startsWith('PLACEHOLDER_PROJECT_IMAGE');

  // Theme variation based on category for placeholders
  const getPlaceholderTheme = (category: string) => {
    switch (category) {
      case 'Jewellery':
        return {
          bg: 'from-amber-500/10 via-amber-100/30 to-slate-50',
          accent: 'border-amber-200 text-amber-900',
          badge: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
          mockUiType: 'jewellery'
        };
      case 'Restaurant':
        return {
          bg: 'from-emerald-500/10 via-emerald-100/30 to-slate-50',
          accent: 'border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80',
          mockUiType: 'restaurant'
        };
      case 'Business':
        return {
          bg: 'from-blue-500/10 via-blue-100/30 to-slate-50',
          accent: 'border-blue-200 text-blue-900',
          badge: 'bg-blue-100/90 text-blue-900 border-blue-300/80',
          mockUiType: 'business'
        };
      case 'Landing Page':
        return {
          bg: 'from-purple-500/10 via-purple-100/30 to-indigo-50/50',
          accent: 'border-purple-200 text-purple-900',
          badge: 'bg-purple-100/90 text-purple-900 border-purple-300/80',
          mockUiType: 'landing'
        };
      case 'Portfolio':
        return {
          bg: 'from-rose-500/10 via-rose-100/30 to-slate-50',
          accent: 'border-rose-200 text-rose-900',
          badge: 'bg-rose-100/90 text-rose-900 border-rose-300/80',
          mockUiType: 'portfolio'
        };
      default:
        return {
          bg: 'from-sky-500/10 via-sky-100/30 to-slate-50',
          accent: 'border-sky-200 text-sky-900',
          badge: 'bg-sky-100/90 text-sky-900 border-sky-300/80',
          mockUiType: 'general'
        };
    }
  };

  if (!isPlaceholder) {
    return (
      <div className={`relative overflow-hidden group bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
          <span className="text-xs font-semibold text-slate-900 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-md">
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Live Preview</span>
          </span>
          <button
            onClick={onClickView}
            className="p-2 rounded-full bg-[#2563EB] text-white shadow-md hover:bg-[#1D4ED8] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const theme = getPlaceholderTheme(project.category);
  const displayUrl = project.url && project.url !== '#' 
    ? project.url.replace(/^https?:\/\//, '') 
    : `${project.id.toLowerCase()}.demo-site.com`;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200/90 bg-gradient-to-br ${theme.bg} p-3.5 flex flex-col justify-between group ${className}`}>
      {/* Top Browser Window Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 text-xs">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/90"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90"></div>
        </div>
        <div className="px-3 py-0.5 rounded-full bg-white/90 text-[10px] tracking-wide font-mono text-slate-600 border border-slate-200/90 flex items-center gap-1 shadow-2xs truncate max-w-[190px]">
          <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
          <span className="truncate">{displayUrl}</span>
        </div>
        <div className="w-3"></div>
      </div>

      {/* Styled Mock Page UI Preview */}
      <div className="my-auto py-4 px-2 flex flex-col items-center justify-center text-center space-y-2.5">
        {/* Category Pill Badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${theme.badge}`}>
          <Sparkles className="w-3 h-3 text-[#2563EB]" />
          <span>{project.category}</span>
        </span>

        {/* Project Title Header inside Mock Screenshot */}
        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-[#2563EB] transition-colors leading-snug">
          {project.title}
        </h4>

        {/* Mock Graphic Lines */}
        <div className="w-full max-w-[180px] space-y-1.5 pt-0.5">
          <div className="h-1.5 bg-slate-300/80 rounded-full w-full"></div>
          <div className="h-1.5 bg-slate-200/80 rounded-full w-3/4 mx-auto"></div>
        </div>
      </div>

      {/* Bottom Controls / Status Bar */}
      <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Interactive Preview</span>
        </div>
        <button 
          onClick={onClickView}
          className="text-[11px] text-[#2563EB] font-bold hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

