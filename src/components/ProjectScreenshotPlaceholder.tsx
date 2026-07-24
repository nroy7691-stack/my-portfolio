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
          bg: 'from-amber-950/80 via-neutral-900 to-amber-900/40',
          accent: 'border-amber-500/30 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          goldHighlight: true,
          mockUiType: 'jewellery'
        };
      case 'Restaurant':
        return {
          bg: 'from-emerald-950/80 via-neutral-900 to-emerald-900/40',
          accent: 'border-emerald-500/30 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          goldHighlight: false,
          mockUiType: 'restaurant'
        };
      case 'Business':
        return {
          bg: 'from-blue-950/80 via-neutral-900 to-slate-900/90',
          accent: 'border-blue-500/30 text-blue-300',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          goldHighlight: false,
          mockUiType: 'business'
        };
      case 'Landing Page':
        return {
          bg: 'from-indigo-950/80 via-neutral-900 to-purple-900/40',
          accent: 'border-purple-500/30 text-purple-300',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          goldHighlight: false,
          mockUiType: 'landing'
        };
      case 'Portfolio':
        return {
          bg: 'from-rose-950/80 via-neutral-900 to-pink-900/40',
          accent: 'border-rose-500/30 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          goldHighlight: false,
          mockUiType: 'portfolio'
        };
      default:
        return {
          bg: 'from-cyan-950/80 via-neutral-900 to-slate-900',
          accent: 'border-cyan-500/30 text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          goldHighlight: false,
          mockUiType: 'general'
        };
    };
  };

  if (!isPlaceholder) {
    return (
      <div className={`relative overflow-hidden group bg-neutral-900 rounded-xl border border-neutral-800 ${className}`}>
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs font-medium text-white/90 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Live Preview
          </span>
        </div>
      </div>
    );
  }

  const theme = getPlaceholderTheme(project.category);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between group ${className}`}>
      {/* Top Browser Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-neutral-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] tracking-wider font-mono text-neutral-300 border border-white/5 truncate max-w-[180px]">
          {project.url !== '#' ? project.url.replace('https://', '') : `${project.id}.example.com`}
        </div>
        <div className="w-4"></div>
      </div>

      {/* Styled Mock Page UI Layout */}
      <div className="my-auto py-5 px-2 flex flex-col items-center justify-center text-center space-y-3">
        {/* Category Pill Badge */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${theme.badge}`}>
          <Sparkles className="w-3 h-3" /> {project.category}
        </span>

        {/* Project Title Header inside Mock Screenshot */}
        <h4 className="text-lg font-semibold text-white tracking-tight group-hover:text-amber-400 transition-colors">
          {project.title}
        </h4>

        {/* Mock Graphic Elements */}
        <div className="w-full max-w-[200px] space-y-1.5 pt-1">
          <div className="h-1.5 bg-white/20 rounded-full w-full"></div>
          <div className="h-1.5 bg-white/10 rounded-full w-4/5 mx-auto"></div>
        </div>

        {/* Notice badge indicating placeholder */}
        <div className="pt-2 text-[10px] text-neutral-400 font-mono flex items-center justify-center gap-1 bg-black/30 px-2 py-1 rounded-md border border-white/5">
          <span>[Screenshot Placeholder]</span>
        </div>
      </div>

      {/* Bottom Controls / Action Hint */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center space-x-1.5 text-[11px] text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ready to showcase</span>
        </div>
        <button 
          onClick={onClickView}
          className="text-[11px] text-amber-400 font-medium hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          View Demo <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
