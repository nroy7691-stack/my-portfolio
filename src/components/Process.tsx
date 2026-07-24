import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Palette, Code, Rocket } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Understand',
      description: 'I understand your business, goals and requirements.',
      icon: Compass,
      details: 'In-depth consultation, market research, target audience identification, and wireframing structure.'
    },
    {
      number: '02',
      title: 'Design',
      description: 'I create a modern and professional website design.',
      icon: Palette,
      details: 'Crafting high-fidelity UI layouts, typography hierarchy, color selection, and interactive component states.'
    },
    {
      number: '03',
      title: 'Build',
      description: 'I develop a responsive and functional website.',
      icon: Code,
      details: 'Writing clean TypeScript/React code, ensuring lightning-fast performance and cross-browser testing.'
    },
    {
      number: '04',
      title: 'Launch',
      description: 'I help prepare the website for launch and delivery.',
      icon: Rocket,
      details: 'Final QA checks, domain setup, static deployment hosting, and delivering project files.'
    }
  ];

  return (
    <section id="process" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
            How I Work
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A structured, transparent 4-step process that ensures your project is completed seamlessly from concept to launch.
          </p>
        </div>

        {/* 4 Step Process Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col justify-between hover:bg-[#F8FAFC] hover:border-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-[#2563EB] group-hover:text-blue-700 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#E5E7EB] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#2563EB] transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-semibold text-[#111827] mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-3">
                    {step.details}
                  </p>
                </div>

                <div className="mt-6 pt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>Step {step.number} of 04</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
