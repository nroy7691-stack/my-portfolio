import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Globe, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  ArrowRight,
  ExternalLink,
  Eye,
  Save,
  Trash2
} from 'lucide-react';
import { 
  HeroConfig, 
  DEFAULT_HERO_CONFIG, 
  getHeroConfig, 
  getLocalHeroConfig, 
  saveHeroConfig 
} from '../../lib/supabase';

interface AdminHeroManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminHeroManager: React.FC<AdminHeroManagerProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState<HeroConfig>(getLocalHeroConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    getHeroConfig().then((config) => {
      setFormData(config);
      setImagePreview(config.hero_image || '');
      setIsLoading(false);
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('Image file size should be less than 5MB.');
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, hero_image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, hero_image: '' }));
    setImagePreview('');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Hero Section back to default headline and buttons?')) {
      setFormData(DEFAULT_HERO_CONFIG);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Hero Title is required');
      return;
    }

    if (!formData.subtitle.trim()) {
      alert('Hero Subtitle is required');
      return;
    }

    setIsSaving(true);
    const result = await saveHeroConfig(formData);
    setIsSaving(false);

    if (result.success) {
      onNotify('Hero Section updated & synced with Supabase successfully!');
    } else {
      onNotify(`Hero updated locally. Note: ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading Hero settings from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        <div>
          <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Hero Section Content Management</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Modify the main headline, subtitle, buttons, and hero image. Updates publish live instantly.
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
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs text-[#0F172A]">
          {/* Badge Text */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Top Pill Badge</h4>
            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Badge Text</label>
              <input
                type="text"
                placeholder="e.g. Modern Web Design & Strategy"
                value={formData.badge_text}
                onChange={(e) => setFormData(prev => ({ ...prev, badge_text: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Headline & Subtitle</h4>
            
            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Hero Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Professional Websites That Help Your Business Grow"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Hero Subtitle *</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. I design modern, responsive and conversion-focused websites..."
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB] leading-relaxed"
              />
            </div>
          </div>

          {/* Hero Buttons */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Hero Buttons (CTAs)</h4>

            {/* Primary Button */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="font-bold text-[#2563EB] block">Primary Button</span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#475569]">Button Label</label>
                  <input
                    type="text"
                    placeholder="e.g. View My Work"
                    value={formData.primary_button_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_button_text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#475569]">Target Link (#anchor or URL)</label>
                  <input
                    type="text"
                    placeholder="#portfolio or https://..."
                    value={formData.primary_button_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_button_link: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="font-bold text-[#475569] block">Secondary Button</span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#475569]">Button Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Let's Work Together"
                    value={formData.secondary_button_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_button_text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#475569]">Target Link (#anchor or URL)</label>
                  <input
                    type="text"
                    placeholder="#contact or https://..."
                    value={formData.secondary_button_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_button_link: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Upload */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Hero Showcase Image (Optional)</h4>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Box */}
              <div className="w-28 h-20 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden shrink-0 flex items-center justify-center relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-[#94A3B8]">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-[9px] block">No image</span>
                  </div>
                )}
              </div>

              {/* Upload controls */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {fileError && <p className="text-red-500 text-[11px] font-semibold">{fileError}</p>}

                <div>
                  <input
                    type="text"
                    placeholder="Or enter image URL (e.g. https://...)"
                    value={formData.hero_image || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, hero_image: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Syncing with Supabase...' : 'Save & Publish Hero Settings'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>Real-time Live Preview</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-md space-y-4 text-center">
            {formData.badge_text && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>{formData.badge_text}</span>
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-tight">
              {formData.title || 'Your Title Here'}
            </h2>

            <p className="text-xs text-[#475569] leading-relaxed max-w-md mx-auto">
              {formData.subtitle || 'Your subtitle description goes here.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {formData.primary_button_text && (
                <div className="px-4 py-2 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1">
                  <span>{formData.primary_button_text}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}

              {formData.secondary_button_text && (
                <div className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#2563EB] text-[#2563EB] font-semibold text-xs">
                  <span>{formData.secondary_button_text}</span>
                </div>
              )}
            </div>

            {formData.hero_image && (
              <div className="pt-3">
                <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                  <img src={formData.hero_image} alt="Preview" className="w-full h-36 object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
