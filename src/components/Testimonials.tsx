import React from 'react';
import { motion } from 'motion/react';
import { testimonialsData } from '../data/testimonialsData';
import { Star, MessageSquareQuote, Info, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Client Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            What Clients Say
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            Real feedback from business owners and partners.
          </p>

          {/* Explicit Notice Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8FBFF] border border-[#DBEAFE] text-[#475569] text-xs text-center max-w-xl mx-auto mt-2 shadow-sm">
            <Info className="w-4 h-4 shrink-0 text-[#2563EB]" />
            <span>
              <strong className="text-[#0F172A]">Sample Placeholders:</strong> The reviews below are sample template placeholders. Replace them in <code className="text-[#2563EB] font-mono bg-[#EFF6FF] px-1 py-0.5 rounded border border-[#E2E8F0]">/src/data/testimonialsData.ts</code> with your actual client reviews.
            </span>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 flex flex-col justify-between hover:bg-[#F8FAFC] hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {/* Header Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
                </div>

                {/* Quote */}
                <p className="text-sm text-[#475569] leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Author details */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{item.clientName}</h4>
                  <p className="text-xs text-[#475569]">{item.role} • {item.company}</p>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE]">
                  {item.projectType}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
