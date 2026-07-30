import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { ArrowUp, Instagram, Linkedin, Twitter, Github, Dribbble, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0F172A] text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  {siteConfig.logoText}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#CBD5E1] font-semibold">
                  {siteConfig.brandName}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#CBD5E1] max-w-sm leading-relaxed">
              Professional websites designed to help businesses grow online.
            </p>

            {/* Social Links Placeholders */}
            <div className="flex items-center space-x-3 pt-2">
              {siteConfig.socialLinks.instagram && (
                <a 
                  href={siteConfig.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.linkedin && (
                <a 
                  href={siteConfig.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.twitter && (
                <a 
                  href={siteConfig.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.github && (
                <a 
                  href={siteConfig.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.dribbble && (
                <a 
                  href={siteConfig.socialLinks.dribbble} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="Dribbble"
                >
                  <Dribbble className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#CBD5E1] font-medium">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="hover:text-[#60A5FA] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours / Availability */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Service Status
            </h4>
            <div className="p-3.5 rounded-xl bg-[#1E293B] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Accepting New Clients</span>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Turnaround times range from 3 to 10 days depending on project scope.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Scroll To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1] font-medium">
          <p>© 2026 ENJEL WEB DESIGN. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-[#60A5FA] hover:text-white hover:border-[#2563EB] transition-colors flex items-center gap-1.5 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors flex items-center gap-1.5 font-semibold"
              aria-label="Scroll to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
