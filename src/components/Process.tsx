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
    <section id="process" className="py-20 lg:py-28 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How I Work
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
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
                className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-amber-400/80 group-hover:text-amber-400 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 group-hover:text-amber-400 group-hover:border-amber-400/30 flex items-center justify-center transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-medium text-neutral-300 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {step.details}
                  </p>
                </div>

                <div className="mt-6 pt-2 text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
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
