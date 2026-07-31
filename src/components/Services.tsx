import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ServiceItem, 
  getStoredServices, 
  fetchServicesFromSupabase, 
  getServiceIcon 
} from '../data/servicesData';
import { ArrowUpRight, Sparkles, Check } from 'lucide-react';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(getStoredServices);

  useEffect(() => {
    fetchServicesFromSupabase().then((data) => {
      setServices(data);
    });

    const handleUpdate = () => {
      setServices(getStoredServices());
    };
    window.addEventListener('services_updated', handleUpdate);
    return () => window.removeEventListener('services_updated', handleUpdate);
  }, []);

  const handleServiceSelect = (serviceTitle: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to auto-select project type in contact form
      window.dispatchEvent(new CustomEvent('select-project-type', { detail: serviceTitle }));
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#FFFFFF] relative overflow-hidden">
      
      {/* Background subtle glowing accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#2563EB]/4 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>My Core Services</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            What I Can Do For You
          </h2>
          
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Tailored, modern web solutions engineered to establish online credibility, captivate audiences, and convert visitors into loyal clients.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.iconName);
            const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between hover:border-[#2563EB]/70 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Top Subtle Accent Line on Hover */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300"></div>

                <div>
                  {/* Top Icon & Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-600/25 transition-all duration-300">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-[#94A3B8] group-hover:text-[#2563EB] px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] transition-colors">
                      {formattedIndex}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-extrabold text-[#0F172A] mb-3 group-hover:text-[#2563EB] transition-colors tracking-tight">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Included Features Bullet Points */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5 pt-5 border-t border-[#F1F5F9] mb-6">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#334155] font-semibold">
                          <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inquiry Action Button */}
                <button
                  type="button"
                  onClick={() => handleServiceSelect(service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 cursor-pointer"
                >
                  <span>Inquire About This</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


