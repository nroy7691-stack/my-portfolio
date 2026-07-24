import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Sparkles, 
  Zap, 
  Layers, 
  Code2, 
  Globe, 
  Layout
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center justify-center bg-neutral-950 text-white">
      {/* Background glow & mesh grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25"></div>
      
      {/* Ambient background blur spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800/80 text-amber-400 text-xs sm:text-sm font-medium shadow-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Modern Web Design & Strategy</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]"
            >
              Professional Websites That Help Your Business <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Grow</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal"
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
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all duration-200 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Let's Work Together</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-3 sm:gap-6"
            >
              <div className="flex items-center gap-2 text-neutral-300 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                  <Layout className="w-4 h-4" />
                </div>
                <span>Modern Design</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-300 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>Mobile Responsive</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-300 text-xs sm:text-sm font-medium">
                <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Fast & Professional</span>
              </div>
            </motion.div>

          </div>

          {/* Right Hero Visual Column - Interactive Web Design Preview Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Frame Wrapper */}
            <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl shadow-black/80 p-3 sm:p-4 backdrop-blur-xl group">
              
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-neutral-800">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>

                {/* Device Viewport Toggle Controls */}
                <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs text-neutral-400 gap-1">
                  <button 
                    onClick={() => setActiveDevice('desktop')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${activeDevice === 'desktop' ? 'bg-amber-400 text-neutral-950 font-semibold' : 'hover:text-white'}`}
                  >
                    Desktop
                  </button>
                  <button 
                    onClick={() => setActiveDevice('tablet')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${activeDevice === 'tablet' ? 'bg-amber-400 text-neutral-950 font-semibold' : 'hover:text-white'}`}
                  >
                    Tablet
                  </button>
                  <button 
                    onClick={() => setActiveDevice('mobile')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${activeDevice === 'mobile' ? 'bg-amber-400 text-neutral-950 font-semibold' : 'hover:text-white'}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* Dynamic Viewport Window */}
              <div className="mt-3 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800/80 p-4 min-h-[340px] flex flex-col justify-between relative transition-all duration-300">
                
                {/* Mock Website Preview inside Frame */}
                <div className={`mx-auto transition-all duration-300 ${
                  activeDevice === 'mobile' ? 'max-w-[220px]' : activeDevice === 'tablet' ? 'max-w-[340px]' : 'w-full'
                }`}>
                  
                  {/* Mock Site Navbar */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-amber-400 flex items-center justify-center text-[9px] font-black text-black">N</div>
                      <span className="text-xs font-bold text-white">NJs Web Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 rounded-full bg-neutral-700"></div>
                      <div className="w-10 h-4 rounded-full bg-amber-400/90 text-[8px] font-bold text-black flex items-center justify-center">Hire</div>
                    </div>
                  </div>

                  {/* Mock Site Hero Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/20 text-left space-y-2.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl"></div>
                    <div className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                      ✦ Premium Experience
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Custom Web Solutions Designed for Results
                    </h3>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      High performance, responsive layout, seamless user experience.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-md bg-amber-400 text-neutral-950 text-[10px] font-bold">
                        Explore Work
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-medium">
                        Contact
                      </div>
                    </div>
                  </div>

                  {/* Mock Feature Tiles Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-amber-400" />
                      <div className="text-[10px]">
                        <div className="font-semibold text-white">Clean Code</div>
                        <div className="text-neutral-400 text-[8px]">Vite + React</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <div className="text-[10px]">
                        <div className="font-semibold text-white">SEO Optimized</div>
                        <div className="text-neutral-400 text-[8px]">Fast Indexing</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Floating Badge Overlay */}
                <div className="absolute -bottom-3 -right-3 bg-neutral-900/95 border border-amber-500/30 p-2.5 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2 text-xs">
                  <div className="p-1.5 rounded-lg bg-amber-400 text-neutral-950">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-[11px]">100% Custom</div>
                    <div className="text-neutral-400 text-[9px]">Tailored to your business</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
