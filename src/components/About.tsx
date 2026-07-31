import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  User, 
  Award 
} from 'lucide-react';
import { 
  AboutConfig, 
  getLocalAboutConfig, 
  getAboutConfig 
} from '../lib/supabase';

export const About: React.FC = () => {
  const [config, setConfig] = useState<AboutConfig>(getLocalAboutConfig);

  useEffect(() => {
    getAboutConfig().then((data) => {
      setConfig(data);
    });

    const handleUpdate = () => {
      setConfig(getLocalAboutConfig());
    };
    window.addEventListener('about_config_updated', handleUpdate);
    return () => window.removeEventListener('about_config_updated', handleUpdate);
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const paragraphs = (config.description || '').split('\n\n').filter(Boolean);

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-b border-[#E2E8F0] overflow-hidden">
      
      {/* Background radial glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Profile Visual Area */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl bg-[#FFFFFF] p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-[#2563EB]/60 transition-all duration-300 text-center overflow-hidden group">
              
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300"></div>

              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none"></div>

              {/* Profile Image Container */}
              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col items-center justify-center p-2 shadow-xs group-hover:border-[#2563EB] transition-colors overflow-hidden">
                
                {config.profile_image ? (
                  <img 
                    src={config.profile_image} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-600/25 mb-3">
                      <User className="w-9 h-9 sm:w-10 sm:h-10" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">ENJEL / NJs Web Designer</span>
                    <span className="text-[11px] text-[#2563EB] font-mono mt-1 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] font-bold">
                      Web Designer & Strategist
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Meta Cards */}
              <div className="mt-6 text-left space-y-3.5 pt-5 border-t border-[#F1F5F9]">
                {config.experience && (
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] p-3 rounded-xl border border-[#BFDBFE] shadow-2xs">
                    <Award className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    <span>{config.experience}</span>
                  </div>
                )}
                
                <div className="space-y-2.5 text-xs text-[#475569] pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#64748B]">Speciality</span>
                    <span className="text-[#2563EB] font-bold">{config.speciality || 'Custom Web Design'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#64748B]">Target Clients</span>
                    <span className="text-[#0F172A] font-semibold">{config.target_clients || 'Businesses & Entrepreneurs'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                    <span className="font-medium text-[#64748B]">Availability</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Available for Projects
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* About Text & Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{config.tag_text || 'About Me'}</span>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              {config.title}
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-4">
              {paragraphs.map((p, pIdx) => (
                <p 
                  key={pIdx} 
                  className={pIdx === 0 
                    ? "text-base sm:text-lg text-[#475569] leading-relaxed font-normal" 
                    : "text-sm sm:text-base text-[#475569] leading-relaxed"
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Key Focus Pillars / Skills Grid */}
            {config.skills && config.skills.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {config.skills.map((skill, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB]/70 hover:shadow-md transition-all duration-300 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{skill}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={scrollToContact}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Work With Me</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

