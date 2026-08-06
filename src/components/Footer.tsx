import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import { ArrowUp, Instagram, Linkedin, Twitter, Github, Dribbble, Youtube, Facebook, ShieldCheck } from 'lucide-react';
import { 
  WebsiteConfig, 
  getLocalWebsiteConfig, 
  getWebsiteConfig 
} from '../lib/supabase';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(getLocalWebsiteConfig);

  useEffect(() => {
    getWebsiteConfig().then((data) => {
      setWebsiteConfig(data);
    });

    const handleUpdate = () => {
      setWebsiteConfig(getLocalWebsiteConfig());
    };
    window.addEventListener('website_config_updated', handleUpdate);
    return () => window.removeEventListener('website_config_updated', handleUpdate);
  }, []);

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
              {websiteConfig.logo_image_url ? (
                <img 
                  src={websiteConfig.logo_image_url} 
                  alt={websiteConfig.website_name}
                  className="w-9 h-9 object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
                  {websiteConfig.logo_initial || 'M'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  {websiteConfig.logo_text || siteConfig.logoText}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#CBD5E1] font-semibold">
                  {websiteConfig.logo_subtext || siteConfig.brandName}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#CBD5E1] max-w-sm leading-relaxed">
              {websiteConfig.footer_text || 'Professional websites designed to help businesses grow online.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {websiteConfig.social_links.instagram && (
                <a 
                  href={websiteConfig.social_links.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {websiteConfig.social_links.linkedin && (
                <a 
                  href={websiteConfig.social_links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {websiteConfig.social_links.twitter && (
                <a 
                  href={websiteConfig.social_links.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {websiteConfig.social_links.github && (
                <a 
                  href={websiteConfig.social_links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {websiteConfig.social_links.dribbble && (
                <a 
                  href={websiteConfig.social_links.dribbble} 
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
          <p>{websiteConfig.copyright_text || `© 2026 ${websiteConfig.website_name || 'MS WEB STUDIO'}. All rights reserved.`}</p>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-[#CBD5E1] hover:text-white hover:border-[#2563EB] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
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
