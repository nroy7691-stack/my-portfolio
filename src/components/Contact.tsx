import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Listen for custom project type selection from Services component
  useEffect(() => {
    const handleSelectProjectType = (e: CustomEvent) => {
      if (e.detail) {
        setFormData(prev => ({ ...prev, projectType: e.detail }));
      }
    };

    window.addEventListener('select-project-type' as any, handleSelectProjectType as any);
    return () => window.removeEventListener('select-project-type' as any, handleSelectProjectType as any);
  }, []);

  const projectOptions = [
    'Business Website',
    'Restaurant Website',
    'Jewellery Website',
    'Portfolio Website',
    'Landing Page',
    'Website Redesign',
    'Custom Project'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build the formatted WhatsApp text strictly matching requirements
    const whatsappMessageText = 
`Hello, I am interested in your web design services.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Project Type: ${formData.projectType}

Message:
${formData.message}

I would like to discuss my project with you.`;

    // Process WhatsApp number from siteConfig
    let targetWhatsAppNumber = siteConfig.whatsappNumber;
    // Strip non-digit characters if provided with + or spaces
    let cleanNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '');

    if (!cleanNumber || targetWhatsAppNumber === 'YOUR_WHATSAPP_NUMBER') {
      // Fallback number format alert for the owner, while still allowing attempt
      alert(`Notice: WHATSAPP_NUMBER is currently set to "${siteConfig.whatsappNumber}" in /src/config/siteConfig.ts. Please update it with your real WhatsApp number in international format (e.g., 919876543210). Opening WhatsApp chat now...`);
      cleanNumber = '919876543210'; // Default sample fallback
    }

    const encodedMessage = encodeURIComponent(whatsappMessageText);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-neutral-900/80 relative border-t border-neutral-800">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Let's Build Something Great Together
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Fill out the form below to send your project details directly via WhatsApp for a fast, personal response.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-2xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Phone / WhatsApp <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {projectOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Project Details / Message <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your business, website goals, timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                    errors.message ? 'border-red-500/80 focus:border-red-500' : 'border-neutral-800 focus:border-amber-400'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 hover:from-emerald-300 hover:to-amber-200 transition-all duration-200 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-5 h-5 text-neutral-950 fill-neutral-950" />
                <span>Send via WhatsApp</span>
              </button>

              <p className="text-[11px] text-neutral-400 text-center font-mono pt-1">
                ⚡ Direct instant connection. No backend registration or email delay.
              </p>

            </form>
          </motion.div>

          {/* Right Column: Contact Information Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Info Box */}
            <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-6 space-y-6">
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Direct Contact Info</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Reach out directly using any of the channels below. Details are configured centrally in <code className="text-amber-300 font-mono">/src/config/siteConfig.ts</code>.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                
                {/* WhatsApp */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">WhatsApp</span>
                      <span className="text-sm font-semibold text-white">
                        {siteConfig.whatsappNumber}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(siteConfig.whatsappNumber, 'whatsapp')}
                    className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-xs"
                    title="Copy WhatsApp Number"
                  >
                    {copiedField === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">Phone</span>
                      <span className="text-sm font-semibold text-white">
                        {siteConfig.phone}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(siteConfig.phone, 'phone')}
                    className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-xs"
                    title="Copy Phone Number"
                  >
                    {copiedField === 'phone' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Email */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">Email</span>
                      <span className="text-sm font-semibold text-white truncate sm:max-w-none">
                        {siteConfig.email}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(siteConfig.email, 'email')}
                    className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-xs"
                    title="Copy Email Address"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

              </div>

              {/* Working Hours / Location */}
              <div className="pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{siteConfig.location}</span>
              </div>

            </div>

            {/* Quick config notification card */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs text-neutral-400 space-y-1">
              <span className="text-amber-400 font-semibold block">⚙️ Site Configuration Notice:</span>
              <p>
                To replace WhatsApp number, Phone or Email with your real business details, open <code className="text-white font-mono">src/config/siteConfig.ts</code>.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
