import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  User, 
  LayoutGrid, 
  Smartphone, 
  HeartHandshake, 
  Target, 
  ShieldCheck 
} from 'lucide-react';

export const About: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlights = [
    { title: "Clean Design", desc: "Minimalist, high-end aesthetics that make your brand stand out." },
    { title: "Mobile Responsiveness", desc: "Flawless layout across smartphones, tablets, and desktop displays." },
    { title: "User Experience", desc: "Intuitive navigation designed to make it effortless for visitors to take action." },
    { title: "Business Goals", desc: "Focused on converting visitors into paying clients and booked appointments." },
    { title: "Professional Presentation", desc: "Building trust and authority for your business from the first second." },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-neutral-900/60 relative border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Profile Visual Area (Can be replaced with real photo) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 p-6 border border-neutral-800 shadow-2xl text-center overflow-hidden group">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Profile Image Container / Placeholder */}
              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-neutral-950 border-2 border-dashed border-neutral-700/80 flex flex-col items-center justify-center p-4 shadow-inner group-hover:border-amber-400/50 transition-colors">
                
                {/* Default Stylish Avatar Representation */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20 mb-3">
                  <User className="w-10 h-10" />
                </div>

                <span className="text-xs font-semibold text-white">ENJEL / NJs Web Designer</span>
                <span className="text-[10px] text-amber-400 font-mono mt-1 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  [Replace with your photo]
                </span>
              </div>

              {/* Profile Description Card */}
              <div className="mt-6 text-left space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Speciality</span>
                  <span className="text-amber-400 font-medium">Custom Web Design</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Target Clients</span>
                  <span className="text-white font-medium">Businesses & Entrepreneurs</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Status</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Available for New Projects
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* About Text & Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About Me</span>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Crafting Modern Websites That Build Trust & Elevate Brands
            </h2>

            {/* Introductory Content */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              I am a professional web designer dedicated to creating clean, modern, and high-converting websites for businesses, professionals, and entrepreneurs.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              In today's digital world, your website is often the very first impression potential clients have of your business. I help you make that first impression unforgettable with an elegant presentation that communicates credibility, quality, and clarity.
            </p>

            {/* Key Focus Pillars Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all duration-200 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Work With Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
