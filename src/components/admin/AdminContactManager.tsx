import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  Copy, 
  Map, 
  Sparkles 
} from 'lucide-react';
import { 
  ContactConfig, 
  DEFAULT_CONTACT_CONFIG, 
  getContactConfig, 
  getLocalContactConfig, 
  saveContactConfig 
} from '../../lib/supabase';

interface AdminContactManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminContactManager: React.FC<AdminContactManagerProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState<ContactConfig>(getLocalContactConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getContactConfig().then((config) => {
      setFormData(config);
      setIsLoading(false);
    });
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm('Reset Contact details back to initial default settings?')) {
      setFormData(DEFAULT_CONTACT_CONFIG);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      alert('Phone number is required.');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email address is required.');
      return;
    }

    setIsSaving(true);
    const result = await saveContactConfig(formData);
    setIsSaving(false);

    if (result.success) {
      onNotify('Contact details updated & synced with Supabase successfully!');
    } else {
      onNotify(`Contact details updated locally. Note: ${result.error}`);
    }
  };

  const cleanWhatsAppNumber = (num: string) => num.replace(/[^0-9]/g, '');

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading Contact settings from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        <div>
          <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#2563EB]" />
            <span>Contact Information Management</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your official WhatsApp number, direct phone, email address, physical location, and Google Maps URL.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs text-[#0F172A]">
          
          {/* WhatsApp & Phone */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Direct Communication</span>
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                WhatsApp Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 917098090109 or +91 70980 90109"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                Used for instant customer chat redirection. Clean format: <span className="font-mono text-[#2563EB]">{cleanWhatsAppNumber(formData.whatsapp_number)}</span>
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Direct Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 70980 90109"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Email & Physical Address */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Email & Address Details</span>
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. nroy7691@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Physical Address / Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Available Worldwide / Remote or 123 Web Design St, City"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Google Maps Link */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Google Maps Link</span>
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Google Maps Share Link or Embed URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://maps.google.com/?q=..."
                value={formData.google_map_link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, google_map_link: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                Provides a direct "View on Google Maps" button for site visitors.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Syncing with Supabase...' : 'Save & Publish Contact Information'}</span>
            </button>
          </div>

        </form>

        {/* Real-time Live Preview Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>Real-time Contact Preview</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h4 className="text-base font-bold text-[#0F172A] mb-1">Direct Contact Info</h4>
              <p className="text-xs text-[#64748B]">
                This is how your contact card will appear to potential clients.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp Preview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">WhatsApp</span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      {formData.whatsapp_number || 'Not Set'}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(formData.whatsapp_number)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-[11px] font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>Chat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Phone Preview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">Phone</span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      {formData.phone || 'Not Set'}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${formData.phone}`}
                  className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] hover:bg-[#2563EB] hover:text-white transition-colors text-[11px] font-bold flex items-center gap-1"
                >
                  <span>Call</span>
                </a>
              </div>

              {/* Email Preview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">Email</span>
                    <span className="text-xs font-bold text-[#0F172A] truncate block">
                      {formData.email || 'Not Set'}
                    </span>
                  </div>
                </div>
                <a
                  href={`mailto:${formData.email}`}
                  className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] hover:bg-[#2563EB] hover:text-white transition-colors text-[11px] font-bold shrink-0 flex items-center gap-1"
                >
                  <span>Mail</span>
                </a>
              </div>
            </div>

            {/* Address Preview */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#475569]">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{formData.address || 'Address Not Set'}</span>
              </div>

              {formData.google_map_link && (
                <a
                  href={formData.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-bold w-full justify-center"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>View Location on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
