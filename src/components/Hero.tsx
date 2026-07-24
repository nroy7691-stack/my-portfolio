import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Smartphone, 
  Sparkles, 
  Zap, 
  Layout
} from 'lucide-react';
import heroImage from '../assets/hero-visual.jpg';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center justify-center bg-white text-slate-900">
      {/* Background glow & mesh grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"></div>
      
      {/* Ambient background blur spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-300/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-medium shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Modern Web Design & Strategy</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.12]"
            >
              Professional Websites That Help Your Business <span className="text-blue-600">Grow</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal"
            >
              I design modern, responsive and conversion-focused websites that help businesses build trust, attract customers and grow online.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={() => scrollToSection('portfolio')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Let's Work Together</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 sm:gap-6"
            >
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Layout className="w-4 h-4" />
                </div>
                <span>Modern Design</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>Mobile Responsive</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Fast & Professional</span>
              </div>
            </motion.div>

          </div>

          {/* Right Hero Visual Column - Hero Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            <div className="relative rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-2.5 sm:p-3 shadow-xl shadow-slate-900/5 group hover:border-[#2563EB] transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                <img 
                  src={heroImage} 
                  alt="ENJEL Web Design Workspace and Monitor Showcase" 
                  className="w-full h-auto object-cover rounded-xl sm:rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
