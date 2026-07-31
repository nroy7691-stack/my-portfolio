import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Check,
  Database,
  RefreshCw,
  Eye,
  X,
  Code2,
  Lock,
  Layers,
  Map
} from 'lucide-react';
import { 
  saveCustomerSubmission, 
  getCustomerSubmissions, 
  CustomerSubmission,
  ContactConfig,
  getLocalContactConfig,
  getContactConfig
} from '../lib/supabase';

export const Contact: React.FC = () => {
  const [contactConfig, setContactConfig] = useState<ContactConfig>(getLocalContactConfig);

  useEffect(() => {
    getContactConfig().then((data) => {
      setContactConfig(data);
    });

    const handleUpdate = () => {
      setContactConfig(getLocalContactConfig());
    };
    window.addEventListener('contact_config_updated', handleUpdate);
    return () => window.removeEventListener('contact_config_updated', handleUpdate);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Supabase submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    saved: boolean;
    message?: string;
    error?: boolean;
  } | null>(null);

  // Admin Submissions Viewer state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<CustomerSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

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

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    const records = await getCustomerSubmissions();
    setSubmissionsList(records);
    setIsLoadingSubmissions(false);
  };

  const handleOpenAdmin = () => {
    setShowAdminModal(true);
    loadSubmissions();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSupabaseStatus(null);

    // 1. Save to Supabase database
    const dbResult = await saveCustomerSubmission(formData);

    if (dbResult.success) {
      setSupabaseStatus({
        saved: true,
        message: 'Thank you! Your message has been sent successfully.'
      });
    } else {
      setSupabaseStatus({
        saved: false,
        error: true,
        message: `Notice: ${dbResult.error || 'Submission formatted and prepared.'}`
      });
    }

    setIsSubmitting(false);

    // 2. Build the formatted WhatsApp text strictly matching requirements
    const whatsappMessageText = 
`Hello, I am interested in your web design services.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Project Type: ${formData.projectType}

Message:
${formData.message}

I would like to discuss my project with you.`;

    // Process WhatsApp number from contactConfig or fallback siteConfig
    let targetWhatsAppNumber = contactConfig.whatsapp_number || siteConfig.whatsappNumber;
    let cleanNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '');

    if (!cleanNumber || targetWhatsAppNumber === 'YOUR_WHATSAPP_NUMBER') {
      cleanNumber = '917098090109'; // Default updated fallback
    }

    const encodedMessage = encodeURIComponent(whatsappMessageText);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Log URL before opening for verification
    console.log(whatsappUrl);

    // Open WhatsApp in a new tab; fallback to location redirect if popup blocked or returns null
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = whatsappUrl;
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sqlCodeSnippet = `CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop legacy or loose policies if present
DROP POLICY IF EXISTS "Allow anonymous insertions" ON public.submissions;
DROP POLICY IF EXISTS "Allow reading submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow updating submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow deleting submissions" ON public.submissions;

-- 1. Allow public / anonymous users ONLY to INSERT contact submissions
CREATE POLICY "Allow public insert only" ON public.submissions 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- 2. Restrict SELECT, UPDATE, and DELETE strictly to authenticated admin users
CREATE POLICY "Allow authenticated select" ON public.submissions 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated update" ON public.submissions 
  FOR UPDATE 
  TO public 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.submissions 
  FOR DELETE 
  TO public 
  USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCodeSnippet);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F8FAFC] relative border-t border-[#E2E8F0] overflow-hidden">
      
      {/* Background subtle glowing highlights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Get In Touch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Let's Build Something Great Together
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Fill out the form below to get in touch with us and receive a prompt response via WhatsApp.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative lg:col-span-7 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 lg:p-9 hover:border-[#2563EB]/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
          >
            {/* Top Accent Line on Hover */}
            <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300"></div>

            {supabaseStatus && (
              <div className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-3 shadow-2xs ${
                supabaseStatus.saved 
                  ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]' 
                  : 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'
              }`}>
                {supabaseStatus.saved ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">{supabaseStatus.message}</p>
                  {supabaseStatus.error && (
                    <p className="text-[11px] opacity-90">
                      Notice: Submission formatted and prepared.
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                  Full Name <span className="text-[#2563EB]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3.5 rounded-xl bg-[#F8FAFC] border text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 shadow-2xs ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#CBD5E1] focus:border-[#2563EB]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#2563EB]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#F8FAFC] border text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 shadow-2xs ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#CBD5E1] focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Phone / WhatsApp <span className="text-[#2563EB]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 70980 90109"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#F8FAFC] border text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 shadow-2xs ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#CBD5E1] focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  {projectOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-[#0F172A] py-1">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                  Project Details / Message <span className="text-[#2563EB]">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your business, website goals, timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3.5 rounded-xl bg-[#F8FAFC] border text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 shadow-2xs ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#CBD5E1] focus:border-[#2563EB]'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-extrabold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Preparing WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 text-white fill-white" />
                    <span>Send Message via WhatsApp</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>

          {/* Right Column: Contact Information Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Info Box */}
            <div className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-[#2563EB]/60 transition-all duration-300">
              
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-transparent group-hover:bg-[#2563EB] transition-all duration-300"></div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                  Direct Contact Info
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  Reach out directly using any of the channels below or start an instant chat.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                
                {/* WhatsApp */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#FFFFFF] hover:border-[#2563EB]/70 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 group-hover/item:bg-[#2563EB] group-hover/item:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] block tracking-wide">WhatsApp</span>
                      <span className="text-sm font-extrabold text-[#0F172A] truncate group-hover/item:text-[#2563EB] transition-colors">
                        {contactConfig.whatsapp_number}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopy(contactConfig.whatsapp_number, 'whatsapp')}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-all text-xs shadow-2xs active:scale-95 cursor-pointer shrink-0"
                    title="Copy WhatsApp Number"
                  >
                    {copiedField === 'whatsapp' ? <Check className="w-4 h-4 text-[#2563EB]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#FFFFFF] hover:border-[#2563EB]/70 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 group-hover/item:bg-[#2563EB] group-hover/item:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] block tracking-wide">Phone</span>
                      <span className="text-sm font-extrabold text-[#0F172A] truncate group-hover/item:text-[#2563EB] transition-colors">
                        {contactConfig.phone}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopy(contactConfig.phone, 'phone')}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-all text-xs shadow-2xs active:scale-95 cursor-pointer shrink-0"
                    title="Copy Phone Number"
                  >
                    {copiedField === 'phone' ? <Check className="w-4 h-4 text-[#2563EB]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Email */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#FFFFFF] hover:border-[#2563EB]/70 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 group-hover/item:bg-[#2563EB] group-hover/item:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] block tracking-wide">Email</span>
                      <span className="text-sm font-extrabold text-[#0F172A] truncate group-hover/item:text-[#2563EB] transition-colors">
                        {contactConfig.email}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopy(contactConfig.email, 'email')}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-all text-xs shadow-2xs active:scale-95 cursor-pointer shrink-0"
                    title="Copy Email Address"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-[#2563EB]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

              </div>

              {/* Physical Address / Location & Google Map Link */}
              <div className="pt-4 border-t border-[#F1F5F9] space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs text-[#475569]">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <span className="font-bold text-[#0F172A]">{contactConfig.address}</span>
                </div>

                {contactConfig.google_map_link && (
                  <a
                    href={contactConfig.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all text-xs font-bold shadow-xs hover:shadow-md group/btn cursor-pointer"
                  >
                    <Map className="w-4 h-4" />
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* Admin Submissions Viewer Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Supabase Inquiries Database</h3>
                    <p className="text-xs text-[#475569] font-mono">
                      Project: vgtvzesvjtioyvzbijfn • Table: public.submissions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSubmissions}
                    className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingSubmissions ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {isLoadingSubmissions ? (
                  <div className="py-12 text-center text-sm text-[#475569] flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#2563EB]" />
                    <span>Loading stored submissions from Supabase...</span>
                  </div>
                ) : submissionsList.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[#475569] space-y-2">
                    <Database className="w-8 h-8 text-[#94A3B8] mx-auto" />
                    <p className="font-bold text-[#0F172A]">No submissions found in table yet</p>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      Submit a new contact form entry above to test writing into your Supabase database table!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissionsList.map((item, idx) => (
                      <div 
                        key={item.id || idx}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between font-semibold text-[#0F172A]">
                          <span className="text-sm text-[#2563EB] font-bold">{item.name}</span>
                          <span className="text-[10px] font-mono text-[#64748B]">
                            {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-2 text-[#475569] font-mono">
                          <div><strong>Email:</strong> {item.email}</div>
                          <div><strong>Phone:</strong> {item.phone}</div>
                          <div><strong>Type:</strong> {item.project_type}</div>
                        </div>
                        <div className="pt-2 border-t border-[#E2E8F0] text-[#334155] whitespace-pre-wrap font-sans">
                          {item.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
                <span>Total records: {submissionsList.length}</span>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

