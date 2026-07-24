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
    <section id="about" className="py-20 lg:py-28 bg-[#F7F7F7] relative border-t border-b border-slate-200/80">
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
            <div className="relative rounded-2xl bg-white p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md hover:bg-[#F8FAFC] hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden group">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Profile Image Container / Placeholder */}
              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#EFF6FF] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-4 shadow-inner group-hover:border-[#2563EB] transition-colors">
                
                {/* Default Stylish Avatar Representation */}
                <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-600/20 mb-3">
                  <User className="w-10 h-10" />
                </div>

                <span className="text-xs font-semibold text-[#111827]">ENJEL / NJs Web Designer</span>
                <span className="text-[10px] text-[#2563EB] font-mono mt-1 px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#E5E7EB] font-medium">
                  [Replace with your photo]
                </span>
              </div>

              {/* Profile Description Card */}
              <div className="mt-6 text-left space-y-3 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Speciality</span>
                  <span className="text-[#2563EB] font-semibold">Custom Web Design</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Target Clients</span>
                  <span className="text-[#111827] font-medium">Businesses & Entrepreneurs</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Status</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>About Me</span>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight">
              Crafting Modern Websites That Build Trust & Elevate Brands
            </h2>

            {/* Introductory Content */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              I am a professional web designer dedicated to creating clean, modern, and high-converting websites for businesses, professionals, and entrepreneurs.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              In today's digital world, your website is often the very first impression potential clients have of your business. I help you make that first impression unforgettable with an elegant presentation that communicates credibility, quality, and clarity.
            </p>

            {/* Key Focus Pillars Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#E5E7EB] text-[#2563EB] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827]">{item.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
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
