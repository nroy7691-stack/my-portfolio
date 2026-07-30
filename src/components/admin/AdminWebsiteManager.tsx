import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Image, 
  Type, 
  Share2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github, 
  Dribbble, 
  Youtube, 
  Facebook, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Copyright, 
  FileText,
  Upload
} from 'lucide-react';
import { 
  WebsiteConfig, 
  DEFAULT_WEBSITE_CONFIG, 
  getWebsiteConfig, 
  getLocalWebsiteConfig, 
  saveWebsiteConfig 
} from '../../lib/supabase';

interface AdminWebsiteManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminWebsiteManager: React.FC<AdminWebsiteManagerProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState<WebsiteConfig>(getLocalWebsiteConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getWebsiteConfig().then((config) => {
      setFormData(config);
      setIsLoading(false);
    });
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm('Reset Website Settings back to default values?')) {
      setFormData(DEFAULT_WEBSITE_CONFIG);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        logo_image_url: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.website_name.trim()) {
      alert('Website name is required.');
      return;
    }

    setIsSaving(true);
    const result = await saveWebsiteConfig(formData);
    setIsSaving(false);

    if (result.success) {
      onNotify('Website Settings updated & published successfully!');
    } else {
      onNotify(`Website Settings updated locally. Note: ${result.error}`);
    }
  };

  const updateSocialLink = (platform: keyof WebsiteConfig['social_links'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading Website Settings from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        <div>
          <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2563EB]" />
            <span>Website Branding & Footer Settings</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Customize site logo, brand name, footer descriptions, social media accounts, and copyright statement.
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
          
          {/* Logo & Brand Details */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Logo & Brand Identity</span>
            </h4>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-[#475569]">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENJEL WEB DESIGN"
                  value={formData.website_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#475569]">
                  Logo Text (Header) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENJEL WEB DESIGN"
                  value={formData.logo_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_text: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-[#475569]">
                  Subtext / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. NJs WEB DESIGN"
                  value={formData.logo_subtext}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_subtext: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#475569]">
                  Badge Initial (Single Letter)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="e.g. E or NJ"
                  value={formData.logo_initial}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_initial: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono font-bold focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Custom Logo Image Option */}
            <div className="pt-2">
              <label className="block font-semibold mb-1 text-[#475569]">
                Custom Logo Image (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Image URL or upload custom logo..."
                  value={formData.logo_image_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_image_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
                <label className="px-3 py-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer text-xs font-bold shrink-0 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                If provided, custom logo image replaces the initial badge. Leave blank to use letter badge.
              </p>
            </div>
          </div>

          {/* Footer Text & Copyright */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Footer Content & Copyright</span>
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Footer Description Paragraph
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Professional websites designed to help businesses grow online."
                value={formData.footer_text}
                onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB] resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Copyright Text
              </label>
              <input
                type="text"
                placeholder="e.g. © 2026 ENJEL WEB DESIGN. All rights reserved."
                value={formData.copyright_text}
                onChange={(e) => setFormData(prev => ({ ...prev, copyright_text: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Social Media Links</span>
            </h4>

            <div className="space-y-2.5">
              <div>
                <label className="flex items-center gap-1.5 font-semibold mb-1 text-[#475569]">
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={formData.social_links.instagram || ''}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 font-semibold mb-1 text-[#475569]">
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.social_links.linkedin || ''}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 font-semibold mb-1 text-[#475569]">
                  <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                  <span>Twitter / X Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/yourhandle"
                  value={formData.social_links.twitter || ''}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 font-semibold mb-1 text-[#475569]">
                  <Github className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.social_links.github || ''}
                  onChange={(e) => updateSocialLink('github', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 font-semibold mb-1 text-[#475569]">
                  <Dribbble className="w-3.5 h-3.5 text-[#EA4C89]" />
                  <span>Dribbble Portfolio URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://dribbble.com/yourportfolio"
                  value={formData.social_links.dribbble || ''}
                  onChange={(e) => updateSocialLink('dribbble', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Supabase...' : 'Save & Publish Website Settings'}</span>
            </button>
          </div>

        </form>

        {/* Live Real-time Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>Live Brand & Footer Preview</span>
          </div>

          {/* Header Logo Preview */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#64748B] block font-bold">
              Header Logo Appearance
            </span>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm flex items-center gap-3">
              {formData.logo_image_url ? (
                <img 
                  src={formData.logo_image_url} 
                  alt="Brand Logo" 
                  className="w-9 h-9 object-contain rounded-xl"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/20">
                  {formData.logo_initial || 'E'}
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#0F172A]">
                  {formData.logo_text || 'LOGO TEXT'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#475569] font-semibold">
                  {formData.logo_subtext || 'BRAND SUBTITLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Card Preview */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-md text-white space-y-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              Footer Dark Theme Appearance
            </span>

            <div className="flex items-center gap-2.5">
              {formData.logo_image_url ? (
                <img 
                  src={formData.logo_image_url} 
                  alt="Brand Logo" 
                  className="w-8 h-8 object-contain rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xs shadow-md">
                  {formData.logo_initial || 'E'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white">
                  {formData.logo_text}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#CBD5E1]">
                  {formData.logo_subtext}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {formData.footer_text || 'No footer text set.'}
            </p>

            {/* Social Icons Preview */}
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
              {formData.social_links.instagram && (
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1]">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
              )}
              {formData.social_links.linkedin && (
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1]">
                  <Linkedin className="w-3.5 h-3.5" />
                </div>
              )}
              {formData.social_links.twitter && (
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1]">
                  <Twitter className="w-3.5 h-3.5" />
                </div>
              )}
              {formData.social_links.github && (
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1]">
                  <Github className="w-3.5 h-3.5" />
                </div>
              )}
              {formData.social_links.dribbble && (
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#CBD5E1]">
                  <Dribbble className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-[#CBD5E1]">
              {formData.copyright_text}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
