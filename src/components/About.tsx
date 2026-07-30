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
    <section id="about" className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Profile Visual Area */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl bg-[#FFFFFF] p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:bg-[#F8FAFC] hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden group">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Profile Image Container */}
              <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#EFF6FF] border-2 border-dashed border-[#DBEAFE] flex flex-col items-center justify-center p-2 shadow-inner group-hover:border-[#2563EB] transition-colors overflow-hidden">
                
                {config.profile_image ? (
                  <img 
                    src={config.profile_image} 
                    alt="ENJEL Profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-600/20 mb-3">
                      <User className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-semibold text-[#0F172A]">ENJEL / NJs Web Designer</span>
                    <span className="text-[10px] text-[#2563EB] font-mono mt-1 px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#DBEAFE] font-medium">
                      Web Designer & Strategist
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Meta Cards */}
              <div className="mt-6 text-left space-y-3 pt-4 border-t border-[#E2E8F0]">
                {config.experience && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] p-2.5 rounded-xl border border-[#DBEAFE]">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>{config.experience}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-[#475569]">
                  <span>Speciality</span>
                  <span className="text-[#2563EB] font-semibold">{config.speciality || 'Custom Web Design'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#475569]">
                  <span>Target Clients</span>
                  <span className="text-[#0F172A] font-medium">{config.target_clients || 'Businesses & Entrepreneurs'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#475569]">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{config.tag_text || 'About Me'}</span>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
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
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">{skill}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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

