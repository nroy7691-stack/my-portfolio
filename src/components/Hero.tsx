import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Smartphone, 
  Sparkles, 
  Zap, 
  Layout,
  ExternalLink
} from 'lucide-react';
import { getHeroConfig, getLocalHeroConfig, HeroConfig } from '../lib/supabase';

export const Hero: React.FC = () => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(getLocalHeroConfig);

  useEffect(() => {
    getHeroConfig().then((data) => {
      setHeroConfig(data);
    });

    const handleUpdate = () => {
      setHeroConfig(getLocalHeroConfig());
    };
    window.addEventListener('hero_config_updated', handleUpdate);
    return () => window.removeEventListener('hero_config_updated', handleUpdate);
  }, []);

  const handleLinkClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      const id = link.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      const el = document.getElementById(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="home" 
      style={{ background: 'linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)' }}
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center justify-center text-[#0F172A]"
    >
      {/* Background glow & mesh grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>
      
      {/* Ambient background blur spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Pill Badge */}
          {heroConfig.badge_text && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs sm:text-sm font-semibold shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{heroConfig.badge_text}</span>
            </motion.div>
          )}

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] sm:leading-[1.12]"
          >
            {heroConfig.title || "Professional Websites That Help Your Business Grow"}
          </motion.h1>

          {/* Subheadline / Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed font-normal px-2 sm:px-0"
          >
            {heroConfig.subtitle || "I design fast, modern, and professional websites that help businesses build trust, attract customers, and grow online."}
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2"
          >
            <button
              onClick={() => handleLinkClick(heroConfig.primary_button_link || '#contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{heroConfig.primary_button_text || "Start Your Project"}</span>
              {heroConfig.primary_button_link?.startsWith('http') ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => handleLinkClick(heroConfig.secondary_button_link || '#portfolio')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-[#2563EB] bg-[#FFFFFF] border border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
            >
              <span>{heroConfig.secondary_button_text || "View My Work"}</span>
            </button>
          </motion.div>

          {/* Tagline below buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="pt-1 text-xs sm:text-sm font-semibold text-[#64748B] tracking-wide flex items-center justify-center gap-2 flex-wrap"
          >
            <span className="inline-flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#2563EB]" />
              Modern Design
            </span>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#2563EB]" />
              Mobile Friendly
            </span>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
              Fast & Reliable
            </span>
          </motion.div>

          {/* Optional Hero Image Display */}
          {heroConfig.hero_image && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="pt-6 max-w-4xl mx-auto"
            >
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-2xl p-2 sm:p-3">
                <img 
                  src={heroConfig.hero_image} 
                  alt={heroConfig.title} 
                  className="w-full max-h-[460px] object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          )}



        </div>
      </div>
    </section>
  );
};
