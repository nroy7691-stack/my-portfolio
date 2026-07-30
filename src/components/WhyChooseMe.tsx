import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Paintbrush, 
  Smartphone, 
  UserCheck, 
  TrendingUp, 
  MessageCircle, 
  SlidersHorizontal 
} from 'lucide-react';

export const WhyChooseMe: React.FC = () => {
  const reasons = [
    {
      title: 'Professional Design',
      desc: 'High-end, elegant visual design tailored specifically to build authority and trust for your brand.',
      icon: Paintbrush
    },
    {
      title: 'Mobile Responsive',
      desc: 'Fluid, pixel-perfect layouts that work flawlessly on all smartphones, tablets, and desktop devices.',
      icon: Smartphone
    },
    {
      title: 'User-Friendly Experience',
      desc: 'Intuitive navigation structures that guide visitors toward taking action without friction.',
      icon: UserCheck
    },
    {
      title: 'Business-Focused Approach',
      desc: 'Websites designed with conversion in mind — helping you generate real inquiries, leads, and sales.',
      icon: TrendingUp
    },
    {
      title: 'Fast Communication',
      desc: 'Direct, clear, and prompt updates throughout the entire project lifespan so you are never left guessing.',
      icon: MessageCircle
    },
    {
      title: 'Custom Solutions',
      desc: 'No cookie-cutter generic templates. Every line of code is tailored to match your precise requirements.',
      icon: SlidersHorizontal
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Value Guarantee</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Why Choose Me
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            I combine modern design aesthetics with strong technical execution to deliver web solutions that drive real business results.
          </p>
        </div>

        {/* Grid of 6 Reasons - Feature Boxes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-[#F8FBFF] border border-[#DBEAFE] p-6 space-y-3 hover:bg-[#FFFFFF] hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-[#475569] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
