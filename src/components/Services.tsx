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
    <section id="services" className="py-20 lg:py-28 bg-[#FFFFFF] relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>My Core Services</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            What I Can Do For You
          </h2>
          
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            Tailored, modern web solutions engineered to establish online credibility, captivate audiences, and convert visitors into loyal clients.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.iconName);
            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-8 flex flex-col justify-between hover:border-[#2563EB] hover:bg-[#F8FAFC] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  {/* Top Icon & Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#475569]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#2563EB] transition-colors">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-[#475569] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Included Features Bullet Points */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-[#E2E8F0] mb-6">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-[#475569] font-medium">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inquiry Action Button */}
                <button
                  onClick={() => handleServiceSelect(service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200 shadow-sm cursor-pointer"
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

