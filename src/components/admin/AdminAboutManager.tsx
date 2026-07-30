import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Save, 
  Trash2, 
  Plus, 
  X, 
  User, 
  CheckCircle2, 
  Briefcase, 
  Award, 
  Eye 
} from 'lucide-react';
import { 
  AboutConfig, 
  DEFAULT_ABOUT_CONFIG, 
  getAboutConfig, 
  getLocalAboutConfig, 
  saveAboutConfig 
} from '../../lib/supabase';

interface AdminAboutManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminAboutManager: React.FC<AdminAboutManagerProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState<AboutConfig>(getLocalAboutConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    getAboutConfig().then((config) => {
      setFormData(config);
      setImagePreview(config.profile_image || '');
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
      setFormData(prev => ({ ...prev, profile_image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, profile_image: '' }));
    setImagePreview('');
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()]
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset About Section back to default content and settings?')) {
      setFormData(DEFAULT_ABOUT_CONFIG);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('About Title is required');
      return;
    }

    if (!formData.description.trim()) {
      alert('About Description is required');
      return;
    }

    setIsSaving(true);
    const result = await saveAboutConfig(formData);
    setIsSaving(false);

    if (result.success) {
      onNotify('About Section updated & synced with Supabase successfully!');
    } else {
      onNotify(`About updated locally. Note: ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading About settings from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        <div>
          <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
            <User className="w-4 h-4 text-[#2563EB]" />
            <span>About Section Management</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your bio headline, main description, skills/highlights, experience details, and profile photo.
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
          
          {/* Tagline & Title */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Title & Tag</h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Section Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. About Me"
                value={formData.tag_text}
                onChange={(e) => setFormData(prev => ({ ...prev, tag_text: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Headline Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Crafting Modern Websites That Build Trust & Elevate Brands"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Bio & Description</h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">About Description *</label>
              <textarea
                rows={5}
                required
                placeholder="Write a clear description of your design approach, philosophy, and experience..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs leading-relaxed focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Experience & Professional Profile Details */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Experience & Meta Info</h4>

            <div>
              <label className="block font-semibold mb-1 text-[#475569]">Experience Summary</label>
              <input
                type="text"
                placeholder="e.g. 5+ Years of Experience building high-converting websites"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold mb-1 text-[#475569]">Speciality</label>
                <input
                  type="text"
                  placeholder="e.g. Custom Web Design & Strategy"
                  value={formData.speciality}
                  onChange={(e) => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#475569]">Target Clients</label>
                <input
                  type="text"
                  placeholder="e.g. Businesses & Entrepreneurs"
                  value={formData.target_clients}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_clients: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Skills & Focus Pillars */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Skills & Key Pillars</h4>

            {/* Existing Skills List */}
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                >
                  <div className="flex items-center gap-2 text-[#0F172A] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{skill}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="p-1 rounded-lg text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add skill (e.g. SEO & Fast Page Speed)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-bold text-[#334155] text-xs uppercase tracking-wider">Profile Photo / Image</h4>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Box */}
              <div className="w-24 h-24 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Upload & Link Controls */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
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
                    value={formData.profile_image || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, profile_image: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Syncing with Supabase...' : 'Save & Publish About Settings'}</span>
            </button>
          </div>

        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>Real-time Live Preview</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-md space-y-4">
            
            {/* Profile Avatar Card */}
            <div className="text-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="mx-auto w-24 h-24 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] overflow-hidden flex items-center justify-center shadow-inner">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">ENJEL / NJs Web Designer</span>
                <span className="text-[10px] text-[#2563EB] font-mono block mt-0.5">
                  {formData.speciality || 'Custom Web Design'}
                </span>
              </div>
            </div>

            {/* Tag & Title */}
            <div>
              {formData.tag_text && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-[10px] font-semibold uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>{formData.tag_text}</span>
                </div>
              )}
              <h3 className="text-lg font-extrabold text-[#0F172A] leading-tight">
                {formData.title || 'Your Title Here'}
              </h3>
            </div>

            {/* Bio Description */}
            <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">
              {formData.description || 'Your bio description...'}
            </p>

            {/* Experience & Meta */}
            {formData.experience && (
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <Award className="w-4 h-4 shrink-0" />
                <span>{formData.experience}</span>
              </div>
            )}

            {/* Skills */}
            {formData.skills.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#334155] block">Skills / Focus Areas:</span>
                {formData.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-[11px] text-[#475569]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
