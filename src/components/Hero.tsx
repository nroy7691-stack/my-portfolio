import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Smartphone, 
  Sparkles, 
  Zap, 
  Layout
} from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs sm:text-sm font-semibold shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Modern Web Design & Strategy</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]"
          >
            Professional Websites That Help Your Business <span className="text-[#2563EB]">Grow</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            I design modern, responsive and conversion-focused websites that help businesses build trust, attract customers and grow online.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => scrollToSection('portfolio')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-[#2563EB] bg-[#FFFFFF] border border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <span>Let's Work Together</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 border-t border-[#E2E8F0] grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mt-6"
          >
            <div className="flex items-center justify-center gap-2 text-[#475569] text-xs sm:text-sm font-medium">
              <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] shrink-0 border border-[#DBEAFE]">
                <Layout className="w-4 h-4" />
              </div>
              <span>Modern Design</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#475569] text-xs sm:text-sm font-medium">
              <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] shrink-0 border border-[#DBEAFE]">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>Mobile Responsive</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#475569] text-xs sm:text-sm font-medium">
              <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] shrink-0 border border-[#DBEAFE]">
                <Zap className="w-4 h-4" />
              </div>
              <span>Fast & Professional</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
