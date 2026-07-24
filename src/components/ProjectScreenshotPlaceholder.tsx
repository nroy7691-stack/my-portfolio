import React from 'react';
import { ExternalLink, Globe, Sparkles } from 'lucide-react';
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
          bg: 'from-amber-100/90 via-slate-50 to-amber-50',
          accent: 'border-amber-300 text-amber-900',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          goldHighlight: true,
          mockUiType: 'jewellery'
        };
      case 'Restaurant':
        return {
          bg: 'from-emerald-100/80 via-slate-50 to-emerald-50',
          accent: 'border-emerald-300 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          goldHighlight: false,
          mockUiType: 'restaurant'
        };
      case 'Business':
        return {
          bg: 'from-blue-100/80 via-slate-50 to-slate-100',
          accent: 'border-blue-300 text-blue-900',
          badge: 'bg-blue-100 text-blue-900 border-blue-300',
          goldHighlight: false,
          mockUiType: 'business'
        };
      case 'Landing Page':
        return {
          bg: 'from-purple-100/80 via-slate-50 to-indigo-50',
          accent: 'border-purple-300 text-purple-900',
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
          goldHighlight: false,
          mockUiType: 'landing'
        };
      case 'Portfolio':
        return {
          bg: 'from-rose-100/80 via-slate-50 to-pink-50',
          accent: 'border-rose-300 text-rose-900',
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          goldHighlight: false,
          mockUiType: 'portfolio'
        };
      default:
        return {
          bg: 'from-cyan-100/80 via-slate-50 to-sky-50',
          accent: 'border-cyan-300 text-cyan-900',
          badge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
          goldHighlight: false,
          mockUiType: 'general'
        };
    };
  };

  if (!isPlaceholder) {
    return (
      <div className={`relative overflow-hidden group bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs font-medium text-slate-900 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-blue-600" /> Live Preview
          </span>
        </div>
      </div>
    );
  }

  const theme = getPlaceholderTheme(project.category);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between group ${className}`}>
      {/* Top Browser Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] tracking-wider font-mono text-slate-700 border border-slate-200/80 truncate max-w-[180px]">
          {project.url !== '#' ? project.url.replace('https://', '') : `${project.id}.example.com`}
        </div>
        <div className="w-4"></div>
      </div>

      {/* Styled Mock Page UI Layout */}
      <div className="my-auto py-5 px-2 flex flex-col items-center justify-center text-center space-y-3">
        {/* Category Pill Badge */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${theme.badge}`}>
          <Sparkles className="w-3 h-3 text-blue-600" /> {project.category}
        </span>

        {/* Project Title Header inside Mock Screenshot */}
        <h4 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {project.title}
        </h4>

        {/* Mock Graphic Elements */}
        <div className="w-full max-w-[200px] space-y-1.5 pt-1">
          <div className="h-1.5 bg-slate-300/80 rounded-full w-full"></div>
          <div className="h-1.5 bg-slate-200/80 rounded-full w-4/5 mx-auto"></div>
        </div>

        {/* Notice badge indicating placeholder */}
        <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1 bg-white/60 px-2 py-1 rounded-md border border-slate-200/80">
          <span>[Screenshot Placeholder]</span>
        </div>
      </div>

      {/* Bottom Controls / Action Hint */}
      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ready to showcase</span>
        </div>
        <button 
          onClick={onClickView}
          className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          View Demo <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
