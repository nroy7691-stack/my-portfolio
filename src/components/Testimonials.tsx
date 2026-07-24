import React from 'react';
import { motion } from 'motion/react';
import { testimonialsData } from '../data/testimonialsData';
import { Star, MessageSquareQuote, Info, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What Clients Say
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Real feedback from business owners and partners.
          </p>

          {/* Explicit Notice Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center max-w-xl mx-auto mt-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Sample Placeholders:</strong> The reviews below are sample template placeholders. Replace them in <code className="text-white font-mono">/src/data/testimonialsData.ts</code> with your actual client reviews.
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
              className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-amber-400/30 transition-colors"
            >
              <div>
                {/* Header Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-neutral-700" />
                </div>

                {/* Quote */}
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Author details */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                  <p className="text-xs text-neutral-400">{item.role} • {item.company}</p>
                </div>
                <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded">
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
