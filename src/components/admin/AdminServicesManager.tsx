import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Search,
  Wrench,
  Layers
} from 'lucide-react';
import { 
  ServiceItem, 
  servicesData, 
  getStoredServices, 
  saveStoredServices, 
  syncServicesToSupabase,
  AVAILABLE_ICON_NAMES, 
  getServiceIcon 
} from '../../data/servicesData';

interface AdminServicesManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminServicesManager: React.FC<AdminServicesManagerProps> = ({ onNotify }) => {
  const [services, setServices] = useState<ServiceItem[]>(getStoredServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Building2',
    featuresText: ''
  });

  useEffect(() => {
    setServices(getStoredServices());
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'Building2',
      featuresText: 'Custom Branding, Lead Forms, SEO Optimized'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      iconName: service.iconName || 'Building2',
      featuresText: service.features ? service.features.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Service Title is required');
      return;
    }

    if (!formData.description.trim()) {
      alert('Service Description is required');
      return;
    }

    const featuresArray = formData.featuresText
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    let updatedList: ServiceItem[];

    if (editingService) {
      // Edit existing service
      updatedList = services.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            title: formData.title.trim(),
            description: formData.description.trim(),
            iconName: formData.iconName,
            icon: getServiceIcon(formData.iconName),
            features: featuresArray
          };
        }
        return s;
      });
    } else {
      // Add new service
      const newService: ServiceItem = {
        id: `service-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        iconName: formData.iconName,
        icon: getServiceIcon(formData.iconName),
        features: featuresArray
      };
      updatedList = [...services, newService];
    }

    setServices(updatedList);
    setIsSaving(true);
    const result = await syncServicesToSupabase(updatedList);
    setIsSaving(false);

    if (editingService) {
      onNotify(`Service "${formData.title}" updated successfully!`);
    } else {
      onNotify(`New service "${formData.title}" added successfully!`);
    }

    closeModal();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) {
      return;
    }

    const updatedList = services.filter(s => s.id !== id);
    setServices(updatedList);
    setIsSaving(true);
    await syncServicesToSupabase(updatedList);
    setIsSaving(false);
    onNotify(`Service "${title}" deleted successfully.`);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all services back to default 6 core services?')) {
      setServices(servicesData);
      setIsSaving(true);
      await syncServicesToSupabase(servicesData);
      setIsSaving(false);
      onNotify('Services reset to default catalog.');
    }
  };

  // Filter services by search query
  const filteredServices = services.filter(s => {
    const query = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      (s.features && s.features.some(f => f.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services by title, description or features..."
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
            <span>Add Service</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-medium cursor-pointer"
            title="Reset Services to Default Catalog"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service, index) => {
          const IconComponent = getServiceIcon(service.iconName);

          return (
            <div 
              key={service.id || index}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition-all shadow-sm group"
            >
              <div className="space-y-3">
                {/* Header Icon + ID */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#94A3B8]">
                    Icon: {service.iconName || 'Building2'}
                  </span>
                </div>

                {/* Service Title */}
                <div>
                  <h3 className="font-extrabold text-[#0F172A] text-base group-hover:text-[#2563EB] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed mt-1 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Features List */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-3 border-t border-[#E2E8F0] space-y-1">
                    {service.features.slice(0, 4).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-[#475569]">
                        <Check className="w-3 h-3 text-[#2563EB] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                    {service.features.length > 4 && (
                      <span className="text-[10px] text-[#94A3B8] font-mono block pl-4">
                        +{service.features.length - 4} more features
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#94A3B8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <p className="text-sm font-bold text-[#0F172A]">No services found</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#2563EB] text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#0F172A] text-lg">
                  {editingService ? 'Edit Service' : 'Add New Service'}
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
              {/* Service Title */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Store Design"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Select Service Icon *</label>
                <div className="flex items-center gap-3">
                  {/* Selected Icon Preview Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#2563EB] text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
                    {React.createElement(getServiceIcon(formData.iconName), { className: "w-6 h-6" })}
                  </div>

                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    {AVAILABLE_ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write a clear description of what this service offers..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs leading-relaxed focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Features List (Comma Separated) */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">
                  Key Features / Highlights (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Custom Design, Lead Generation, SEO Optimized, Speed Guarantee"
                  value={formData.featuresText}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuresText: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Action Buttons */}
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
                  <span>{editingService ? 'Save Changes' : 'Add Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
