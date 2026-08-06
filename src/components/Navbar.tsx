import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, MessageSquareCode } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { 
  WebsiteConfig, 
  getLocalWebsiteConfig, 
  getWebsiteConfig 
} from '../lib/supabase';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  onOpenAdmin?: () => void;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(getLocalWebsiteConfig);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Section observer logic
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] py-3.5 shadow-sm' 
          : 'bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#E2E8F0]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <img 
              src={websiteConfig.logo_image_url || '/logo.png'} 
              alt={websiteConfig.website_name || 'MS Web Studio'}
              className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] object-contain shrink-0 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {websiteConfig.logo_text || siteConfig.logoText || 'MS WEB STUDIO'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#475569] font-semibold">
                {websiteConfig.logo_subtext || siteConfig.brandName || 'MS WEB STUDIO'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#F8FAFC] backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'text-white bg-[#2563EB] font-bold shadow-sm' 
                      : 'text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EFF6FF]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA Button & Admin Trigger */}
          <div className="hidden md:flex items-center gap-2.5">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200"
                title="Open Admin Panel"
              >
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              </button>
            )}

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-full transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Let's Work Together</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>


          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] backdrop-blur-xl border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-3 mt-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1 pt-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#2563EB] text-white font-bold' 
                      : 'text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="pt-2 border-t border-[#E2E8F0]">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-600/20"
            >
              <MessageSquareCode className="w-5 h-5" />
              <span>Let's Work Together</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
