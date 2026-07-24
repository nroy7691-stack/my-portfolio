import React from 'react';
import { motion } from 'motion/react';
import { servicesData } from '../data/servicesData';
import { ArrowUpRight, Sparkles, Check } from 'lucide-react';

export const Services: React.FC = () => {
  const handleServiceSelect = (serviceTitle: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to auto-select project type in contact form
      window.dispatchEvent(new CustomEvent('select-project-type', { detail: serviceTitle }));
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-neutral-950 relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Core Services</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What I Can Do For You
          </h2>
          
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Tailored, modern web solutions engineered to establish online credibility, captivate audiences, and convert visitors into loyal clients.
          </p>
        </div>

        {/* Services Grid (6 Cards) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-neutral-900/80 border border-neutral-800 p-8 flex flex-col justify-between hover:border-amber-400/40 hover:bg-neutral-900 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div>
                  {/* Top Icon & Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-300 shadow-md">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Included Features Bullet Points */}
                  <div className="space-y-2 pt-4 border-t border-neutral-800/80 mb-6">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquiry Action Button */}
                <button
                  onClick={() => handleServiceSelect(service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-300 bg-neutral-950 border border-neutral-800 group-hover:border-amber-400/40 group-hover:text-amber-300 group-hover:bg-neutral-900 transition-all duration-200"
                >
                  <span>Inquire About This</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
