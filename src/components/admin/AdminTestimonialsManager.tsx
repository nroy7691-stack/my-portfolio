import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Star, 
  Search, 
  MessageSquareQuote, 
  User, 
  Upload, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { 
  Testimonial, 
  testimonialsData, 
  getStoredTestimonials, 
  syncTestimonialsToSupabase 
} from '../../data/testimonialsData';

interface AdminTestimonialsManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminTestimonialsManager: React.FC<AdminTestimonialsManagerProps> = ({ onNotify }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getStoredTestimonials);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    clientName: '',
    role: '',
    company: '',
    projectType: 'Business Website',
    rating: 5,
    quote: '',
    avatarUrl: ''
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    setTestimonials(getStoredTestimonials());
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      role: 'Owner',
      company: '',
      projectType: 'Business Website',
      rating: 5,
      quote: '',
      avatarUrl: ''
    });
    setAvatarPreview('');
    setFileError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName,
      role: item.role || '',
      company: item.company || '',
      projectType: item.projectType || 'Business Website',
      rating: item.rating || 5,
      quote: item.quote,
      avatarUrl: item.avatarUrl || ''
    });
    setAvatarPreview(item.avatarUrl || '');
    setFileError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.');
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, avatarUrl: result }));
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearAvatar = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
    setAvatarPreview('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim()) {
      alert('Client Name is required.');
      return;
    }

    if (!formData.quote.trim()) {
      alert('Review / Quote text is required.');
      return;
    }

    let updatedList: Testimonial[];

    if (editingItem) {
      updatedList = testimonials.map(t => {
        if (t.id === editingItem.id) {
          return {
            ...t,
            clientName: formData.clientName.trim(),
            role: formData.role.trim() || 'Client',
            company: formData.company.trim(),
            projectType: formData.projectType.trim() || 'Web Design',
            rating: formData.rating,
            quote: formData.quote.trim(),
            avatarUrl: formData.avatarUrl,
            isPlaceholder: false
          };
        }
        return t;
      });
    } else {
      const newItem: Testimonial = {
        id: `testi-${Date.now()}`,
        clientName: formData.clientName.trim(),
        role: formData.role.trim() || 'Client',
        company: formData.company.trim(),
        projectType: formData.projectType.trim() || 'Web Design',
        rating: formData.rating,
        quote: formData.quote.trim(),
        avatarUrl: formData.avatarUrl,
        isPlaceholder: false
      };
      updatedList = [newItem, ...testimonials];
    }

    setTestimonials(updatedList);
    setIsSaving(true);
    await syncTestimonialsToSupabase(updatedList);
    setIsSaving(false);

    if (editingItem) {
      onNotify(`Testimonial for "${formData.clientName}" updated!`);
    } else {
      onNotify(`New testimonial for "${formData.clientName}" added!`);
    }

    closeModal();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial by "${name}"?`)) {
      return;
    }

    const updatedList = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedList);
    setIsSaving(true);
    await syncTestimonialsToSupabase(updatedList);
    setIsSaving(false);
    onNotify(`Testimonial by "${name}" deleted.`);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset testimonials back to default sample reviews?')) {
      setTestimonials(testimonialsData);
      setIsSaving(true);
      await syncTestimonialsToSupabase(testimonialsData);
      setIsSaving(false);
      onNotify('Testimonials reset to default catalog.');
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(q) ||
      t.quote.toLowerCase().includes(q) ||
      (t.company && t.company.toLowerCase().includes(q)) ||
      (t.role && t.role.toLowerCase().includes(q)) ||
      (t.projectType && t.projectType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search testimonials by client name, review content, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-medium cursor-pointer"
            title="Reset Testimonials to Default Samples"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTestimonials.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition-all shadow-sm group"
          >
            <div className="space-y-3">
              {/* Stars & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <MessageSquareQuote className="w-5 h-5 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
              </div>

              {/* Quote / Review Text */}
              <p className="text-xs text-[#475569] leading-relaxed italic line-clamp-4">
                "{item.quote}"
              </p>
            </div>

            {/* Author Footer & Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] overflow-hidden shrink-0 flex items-center justify-center text-[#2563EB]">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>

                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate">{item.clientName}</h4>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {item.role}{item.company ? ` • ${item.company}` : ''}
                    </p>
                  </div>
                </div>

                {item.projectType && (
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE] shrink-0">
                    {item.projectType}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F1F5F9]">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.clientName)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#94A3B8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <p className="text-sm font-bold text-[#0F172A]">No testimonials found</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#2563EB] text-white">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#0F172A] text-lg">
                  {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#0F172A]">
              
              {/* Client Name & Star Rating */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Dhar"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Rating (1 to 5 Stars) *</label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-mono font-bold text-xs text-[#2563EB]">{formData.rating} / 5</span>
                  </div>
                </div>
              </div>

              {/* Role & Company */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Client Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & CEO, Store Manager"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Company / Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhar Jewellery House"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Project Type Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Jewellery Website, Business Website, Restaurant Website"
                  value={formData.projectType}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Review / Quote Text */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Client Review / Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the client's review or testimonial quote..."
                  value={formData.quote}
                  onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs leading-relaxed focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Client Photo Avatar Upload */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Client Photo / Avatar</label>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  
                  {/* Avatar Preview */}
                  <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] overflow-hidden shrink-0 flex items-center justify-center text-[#2563EB] shadow-sm">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Client Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>

                  {/* File Upload Controls */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleClearAvatar}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {fileError && <p className="text-red-500 text-[10px] font-semibold">{fileError}</p>}

                    <input
                      type="text"
                      placeholder="Or enter image URL (e.g. https://...)"
                      value={formData.avatarUrl}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, avatarUrl: e.target.value }));
                        setAvatarPreview(e.target.value);
                      }}
                      className="w-full px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[11px] font-mono focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] font-bold hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Add Testimonial'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
