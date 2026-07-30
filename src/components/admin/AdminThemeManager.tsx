import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  RotateCcw, 
  Save, 
  Eye, 
  Sparkles, 
  Check, 
  Layout, 
  Square, 
  MousePointerClick,
  Layers
} from 'lucide-react';
import { 
  ThemeConfig, 
  DEFAULT_THEME_CONFIG, 
  getThemeConfig, 
  getLocalThemeConfig, 
  saveThemeConfig, 
  applyThemeConfig 
} from '../../lib/supabase';

interface AdminThemeManagerProps {
  onNotify: (msg: string) => void;
}

const AVAILABLE_FONTS = [
  { name: 'Plus Jakarta Sans', category: 'Modern Sans-Serif' },
  { name: 'Inter', category: 'Clean Tech' },
  { name: 'Outfit', category: 'Geometric Modern' },
  { name: 'Poppins', category: 'Friendly Geometric' },
  { name: 'Playfair Display', category: 'Elegant Serif' },
  { name: 'Space Grotesk', category: 'Futuristic' },
  { name: 'DM Sans', category: 'Minimalist' },
  { name: 'Montserrat', category: 'Bold Display' },
  { name: 'Roboto', category: 'Classic Standard' },
  { name: 'Sora', category: 'High Contrast Sans' },
  { name: 'Syne', category: 'Creative Modern' }
];

const PRESET_THEMES: { name: string; theme: ThemeConfig }[] = [
  {
    name: 'Modern Blue (Default)',
    theme: {
      id: 'default',
      primary_color: '#2563EB',
      secondary_color: '#0F172A',
      background_color: '#FFFFFF',
      card_color: '#FFFFFF',
      button_color: '#2563EB',
      font_family: 'Plus Jakarta Sans'
    }
  },
  {
    name: 'Emerald Luxe',
    theme: {
      id: 'default',
      primary_color: '#059669',
      secondary_color: '#064E3B',
      background_color: '#F0FDF4',
      card_color: '#FFFFFF',
      button_color: '#059669',
      font_family: 'Outfit'
    }
  },
  {
    name: 'Royal Violet',
    theme: {
      id: 'default',
      primary_color: '#7C3AED',
      secondary_color: '#2E1065',
      background_color: '#FAF5FF',
      card_color: '#FFFFFF',
      button_color: '#7C3AED',
      font_family: 'Poppins'
    }
  },
  {
    name: 'Warm Amber',
    theme: {
      id: 'default',
      primary_color: '#D97706',
      secondary_color: '#451A03',
      background_color: '#FFFBEB',
      card_color: '#FFFFFF',
      button_color: '#D97706',
      font_family: 'DM Sans'
    }
  },
  {
    name: 'Rose Gold',
    theme: {
      id: 'default',
      primary_color: '#E11D48',
      secondary_color: '#4C0519',
      background_color: '#FFF1F2',
      card_color: '#FFFFFF',
      button_color: '#E11D48',
      font_family: 'Playfair Display'
    }
  },
  {
    name: 'Midnight Dark',
    theme: {
      id: 'default',
      primary_color: '#3B82F6',
      secondary_color: '#F8FAFC',
      background_color: '#0F172A',
      card_color: '#1E293B',
      button_color: '#2563EB',
      font_family: 'Space Grotesk'
    }
  }
];

export const AdminThemeManager: React.FC<AdminThemeManagerProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState<ThemeConfig>(getLocalThemeConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getThemeConfig().then((config) => {
      setFormData(config);
      applyThemeConfig(config);
      setIsLoading(false);
    });
  }, []);

  const handleChange = (field: keyof ThemeConfig, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    applyThemeConfig(updated);
  };

  const applyPreset = (preset: ThemeConfig) => {
    setFormData(preset);
    applyThemeConfig(preset);
    onNotify(`Applied preset: ${preset.font_family}`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Theme back to original defaults?')) {
      setFormData(DEFAULT_THEME_CONFIG);
      applyThemeConfig(DEFAULT_THEME_CONFIG);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await saveThemeConfig(formData);
    setIsSaving(false);

    if (result.success) {
      onNotify('Theme settings saved & published across the website!');
    } else {
      onNotify(`Theme saved locally. Note: ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading Theme settings from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        <div>
          <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#2563EB]" />
            <span>Theme & Color Customization</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Customize primary colors, card surfaces, button colors, and typography. Changes apply in real-time across the entire website.
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

      {/* Quick Theme Presets */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl shadow-sm space-y-3">
        <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Quick Theme Presets</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {PRESET_THEMES.map((p) => {
            const isActive = formData.primary_color === p.theme.primary_color && formData.font_family === p.theme.font_family;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p.theme)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isActive
                    ? 'border-[#2563EB] bg-[#EFF6FF] shadow-sm ring-2 ring-[#2563EB]/20'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#FFFFFF] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: p.theme.primary_color }} />
                  <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: p.theme.secondary_color }} />
                  <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: p.theme.background_color }} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block truncate">{p.name}</span>
                  <span className="text-[10px] text-[#64748B] block truncate">{p.theme.font_family}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs text-[#0F172A]">
          
          {/* Colors Management */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Color Palette Controls</span>
            </h4>

            {/* Primary Color */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => handleChange('primary_color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] cursor-pointer p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">Primary Accent Color</span>
                  <span className="text-[11px] text-[#64748B]">Brand highlights, links, badges</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.primary_color}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] font-mono font-bold text-center text-xs"
              />
            </div>

            {/* Secondary Color */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => handleChange('secondary_color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] cursor-pointer p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">Secondary / Dark Heading Color</span>
                  <span className="text-[11px] text-[#64748B]">Headings, dark cards, dark navbar elements</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.secondary_color}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] font-mono font-bold text-center text-xs"
              />
            </div>

            {/* Background Color */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.background_color}
                  onChange={(e) => handleChange('background_color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] cursor-pointer p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">Background Color</span>
                  <span className="text-[11px] text-[#64748B]">Main page canvas background</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] font-mono font-bold text-center text-xs"
              />
            </div>

            {/* Card Color */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.card_color}
                  onChange={(e) => handleChange('card_color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] cursor-pointer p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">Card / Surface Color</span>
                  <span className="text-[11px] text-[#64748B]">Service cards, portfolio items, form containers</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.card_color}
                onChange={(e) => handleChange('card_color', e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] font-mono font-bold text-center text-xs"
              />
            </div>

            {/* Button Color */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.button_color}
                  onChange={(e) => handleChange('button_color', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] cursor-pointer p-0 bg-transparent shrink-0"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">Button Color</span>
                  <span className="text-[11px] text-[#64748B]">Call-to-action buttons, submit actions</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.button_color}
                onChange={(e) => handleChange('button_color', e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] font-mono font-bold text-center text-xs"
              />
            </div>

          </div>

          {/* Typography Settings */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Typography Font Selection</span>
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">
                Website Primary Font Family
              </label>
              <select
                value={formData.font_family}
                onChange={(e) => handleChange('font_family', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                Font Sample Preview: {formData.font_family}
              </span>
              <p 
                className="text-sm font-semibold text-[#0F172A] leading-relaxed"
                style={{ fontFamily: `'${formData.font_family}', sans-serif` }}
              >
                The quick brown fox jumps over the lazy dog. 1234567890
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: formData.button_color }}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing Theme...' : 'Save & Publish Theme Settings'}</span>
            </button>
          </div>

        </form>

        {/* Live Real-Time Component Mockup */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>Instant Website Theme Mockup</span>
          </div>

          <div 
            className="p-6 rounded-2xl border border-[#E2E8F0] shadow-md space-y-5 transition-all"
            style={{ 
              backgroundColor: formData.background_color,
              fontFamily: `'${formData.font_family}', sans-serif`
            }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: formData.primary_color }}
              >
                Primary Badge
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {formData.font_family}
              </span>
            </div>

            {/* Heading sample */}
            <div>
              <h2 
                className="text-xl font-extrabold tracking-tight mb-1"
                style={{ color: formData.secondary_color }}
              >
                Custom Web Design Experience
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                This component shows how your selected colors and typography immediately change the look and feel of your app.
              </p>
            </div>

            {/* Card sample */}
            <div 
              className="p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3 transition-colors"
              style={{ backgroundColor: formData.card_color }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Sample Card Component</h4>
                  <span className="text-[10px] text-[#64748B]">Surface Color: {formData.card_color}</span>
                </div>
              </div>

              <p className="text-xs text-[#475569]">
                Cards automatically adopt the specified card background and typography font.
              </p>

              <button
                type="button"
                className="w-full py-2 px-4 rounded-xl text-white font-bold text-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                style={{ backgroundColor: formData.button_color }}
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>Primary Button Action</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
