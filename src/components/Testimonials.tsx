import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Testimonial, 
  getStoredTestimonials, 
  fetchTestimonialsFromSupabase 
} from '../data/testimonialsData';
import { Star, MessageSquareQuote, Info, Sparkles, User, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getStoredTestimonials);

  useEffect(() => {
    fetchTestimonialsFromSupabase().then((data) => {
      setTestimonials(data);
    });

    const handleUpdate = () => {
      setTestimonials(getStoredTestimonials());
    };
    window.addEventListener('testimonials_updated', handleUpdate);
    return () => window.removeEventListener('testimonials_updated', handleUpdate);
  }, []);

  const hasPlaceholders = testimonials.some(t => t.isPlaceholder);

  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] relative overflow-hidden">
      
      {/* Background subtle glowing accents */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#2563EB]/4 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Client Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            What Clients Say
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Real feedback from business owners, partners, and clients I've worked with.
          </p>

          {/* Explicit Notice Label for Placeholders */}
          {hasPlaceholders && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8FBFF] border border-[#BFDBFE] text-[#475569] text-xs text-center max-w-xl mx-auto mt-2 shadow-xs">
              <Info className="w-4 h-4 shrink-0 text-[#2563EB]" />
              <span>
                <strong className="text-[#0F172A] font-semibold">Sample Reviews:</strong> Customize or replace these testimonials anytime via the Admin Panel.
              </span>
            </div>
          )}
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#2563EB]/70 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 h-full"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300"></div>

              <div>
                {/* Header Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500 stroke-[1]" />
                    ))}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Quote className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* Quote / Review Text */}
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed italic mb-6 font-normal">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Details Footer */}
              <div className="pt-5 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Client Photo Avatar */}
                  <div className="w-11 h-11 rounded-full bg-[#EFF6FF] border-2 border-[#BFDBFE] overflow-hidden shrink-0 flex items-center justify-center text-[#2563EB] font-bold text-xs shadow-xs group-hover:border-[#2563EB] transition-colors">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#2563EB]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-[#0F172A] leading-tight truncate group-hover:text-[#2563EB] transition-colors">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-[#64748B] font-medium truncate mt-0.5">
                      {item.role}{item.company ? ` • ${item.company}` : ''}
                    </p>
                  </div>
                </div>

                {item.projectType && (
                  <span className="text-[11px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE] shrink-0">
                    {item.projectType}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};


