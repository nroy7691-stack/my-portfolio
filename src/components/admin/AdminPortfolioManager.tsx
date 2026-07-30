import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Globe, 
  Tag, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import { 
  Project, 
  ProjectCategory, 
  portfolioCategories, 
  getStoredProjects, 
  saveStoredProjects,
  portfolioProjects 
} from '../../data/portfolioData';

interface AdminPortfolioManagerProps {
  onNotify: (msg: string) => void;
}

export const AdminPortfolioManager: React.FC<AdminPortfolioManagerProps> = ({ onNotify }) => {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Business' as ProjectCategory,
    description: '',
    image: '',
    url: '',
    technologies: '',
    featured: false,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Business',
      description: '',
      image: 'PLACEHOLDER_PROJECT_IMAGE_1',
      url: 'https://',
      technologies: 'React, Tailwind CSS, TypeScript',
      featured: false,
    });
    setImagePreview('');
    setFileError('');
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image,
      url: project.url,
      technologies: project.technologies.join(', '),
      featured: !!project.featured,
    });
    setImagePreview(project.image);
    setFileError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  // Image File Upload Handler (FileReader to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    // Limit size check (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Image file size should be less than 5MB.');
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Project Title is required');
      return;
    }

    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    let updatedList: Project[];

    if (editingProject) {
      // Edit existing
      updatedList = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: formData.title.trim(),
            category: formData.category,
            description: formData.description.trim(),
            image: formData.image.trim() || 'PLACEHOLDER_PROJECT_IMAGE_1',
            url: formData.url.trim(),
            technologies: techArray.length > 0 ? techArray : ['React'],
            featured: formData.featured,
          };
        }
        return p;
      });
      onNotify(`Project "${formData.title}" updated successfully!`);
    } else {
      // Create new
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim() || 'PLACEHOLDER_PROJECT_IMAGE_1',
        url: formData.url.trim() || '#',
        technologies: techArray.length > 0 ? techArray : ['React', 'Tailwind CSS'],
        featured: formData.featured,
      };
      updatedList = [newProject, ...projects];
      onNotify(`New project "${formData.title}" added successfully!`);
    }

    setProjects(updatedList);
    saveStoredProjects(updatedList);
    closeModal();
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the project "${title}"?`)) {
      return;
    }

    const updatedList = projects.filter(p => p.id !== id);
    setProjects(updatedList);
    saveStoredProjects(updatedList);
    onNotify(`Project "${title}" deleted.`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all portfolio projects back to default showcase list? Custom edits will be restored.')) {
      setProjects(portfolioProjects);
      saveStoredProjects(portfolioProjects);
      onNotify('Portfolio reset to default projects.');
    }
  };

  // Filter projects by search and category
  const filteredProjects = projects.filter(p => {
    const matchesQuery = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, tech or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="All">All Categories</option>
            {portfolioCategories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Add Project Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-medium cursor-pointer"
            title="Reset Portfolio to Default Showcase Items"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid / List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const isPlaceholder = !project.image || project.image.startsWith('PLACEHOLDER_PROJECT_IMAGE');

          return (
            <div 
              key={project.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#2563EB] transition-all shadow-sm group"
            >
              <div className="space-y-3">
                {/* Thumbnail Preview Header */}
                <div className="h-36 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] relative flex items-center justify-center">
                  {!isPlaceholder ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-3 text-center space-y-1 text-[#64748B]">
                      <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto" />
                      <span className="text-[10px] font-mono block">Preset Screenshot</span>
                    </div>
                  )}

                  {project.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-semibold text-[10px]">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0F172A] text-base group-hover:text-[#2563EB] transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#475569] line-clamp-2 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-mono text-[10px]">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#94A3B8] text-[10px]">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2563EB] font-bold flex items-center gap-1 hover:underline truncate max-w-[140px]"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{project.url === '#' ? 'No live URL' : project.url.replace('https://', '')}</span>
                </a>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#94A3B8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3">
          <ImageIcon className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <p className="text-sm font-bold text-[#0F172A]">No projects found</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Your First Project
          </button>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#2563EB] text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#0F172A] text-lg">
                  {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#0F172A]">
              {/* Title & Category Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury Villa Website"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#334155]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProjectCategory }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    {portfolioCategories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the project overview, goals, or client details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Live URL */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">Live Project Link (URL)</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Screenshot Upload & Image URL */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <label className="block font-bold text-[#334155]">
                  Project Screenshot / Thumbnail
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview && !imagePreview.startsWith('PLACEHOLDER_PROJECT_IMAGE') ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-[#94A3B8]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[9px] block">Placeholder</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Project Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-[#64748B] block mt-1">
                        Select an image file (PNG, JPG, WebP max 5MB)
                      </span>
                    </div>

                    {fileError && (
                      <p className="text-red-500 text-[11px] font-semibold">{fileError}</p>
                    )}

                    <div>
                      <input
                        type="text"
                        placeholder="Or enter Image URL (e.g. https://... or PLACEHOLDER_PROJECT_IMAGE_1)"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, image: e.target.value }));
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[11px] font-mono focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies (Comma-Separated) */}
              <div>
                <label className="block font-bold mb-1 text-[#334155]">
                  Technologies Stack (comma separated)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="React, Tailwind CSS, TypeScript, E-Commerce"
                    value={formData.technologies}
                    onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#CBD5E1] cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-[#334155] cursor-pointer">
                  Mark as Featured Project on Showcase
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] font-bold hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
