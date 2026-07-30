import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FolderKanban, 
  Wrench, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Phone, 
  Mail, 
  ExternalLink, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Sparkles,
  Layers,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { CustomerSubmission } from '../../lib/supabase';
import { Project } from '../../data/portfolioData';
import { ServiceItem } from '../../data/servicesData';
import { openWhatsAppReply } from './adminUtils';

interface AdminDashboardProps {
  submissions: CustomerSubmission[];
  projects: Project[];
  services: ServiceItem[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  onNavigateTab: (tab: 'inquiries' | 'portfolio' | 'services') => void;
  onNotify: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  projects,
  services,
  onUpdateStatus,
  onDeleteInquiry,
  onNavigateTab,
  onNotify
}) => {
  // --- Enquiries Search, Filter & Pagination State ---
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [enquiryPage, setEnquiryPage] = useState(1);
  const [enquiryPageSize, setEnquiryPageSize] = useState(5);
  const [selectedEnquiryModal, setSelectedEnquiryModal] = useState<CustomerSubmission | null>(null);

  // --- Projects Search, Filter & Pagination State ---
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectPage, setProjectPage] = useState(1);
  const [projectPageSize, setProjectPageSize] = useState(5);

  // --- Metrics Calculations ---
  const metrics = useMemo(() => {
    const totalEnquiries = submissions.length;
    const newEnquiries = submissions.filter(s => (s.status || 'new').toLowerCase() === 'new').length;
    const contactedEnquiries = submissions.filter(s => (s.status || '').toLowerCase() === 'contacted' || (s.status || '').toLowerCase() === 'in progress').length;
    const completedEnquiries = submissions.filter(s => (s.status || '').toLowerCase() === 'completed').length;

    const totalProjects = projects.length;
    const featuredProjects = projects.filter(p => p.featured).length;

    const totalServices = services.length;

    return {
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      completedEnquiries,
      totalProjects,
      featuredProjects,
      totalServices
    };
  }, [submissions, projects, services]);

  // --- Filtered Enquiries ---
  const filteredEnquiries = useMemo(() => {
    return submissions.filter(sub => {
      const q = enquirySearch.toLowerCase();
      const matchesSearch = 
        (sub.name || '').toLowerCase().includes(q) ||
        (sub.email || '').toLowerCase().includes(q) ||
        (sub.phone || '').toLowerCase().includes(q) ||
        (sub.project_type || '').toLowerCase().includes(q) ||
        (sub.message || '').toLowerCase().includes(q);

      const matchesStatus = 
        enquiryStatusFilter === 'All' || 
        (sub.status || 'new').toLowerCase() === enquiryStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [submissions, enquirySearch, enquiryStatusFilter]);

  // Paginated Enquiries
  const totalEnquiryPages = Math.max(1, Math.ceil(filteredEnquiries.length / enquiryPageSize));
  const currentEnquiryPage = Math.min(enquiryPage, totalEnquiryPages);
  const paginatedEnquiries = useMemo(() => {
    const start = (currentEnquiryPage - 1) * enquiryPageSize;
    return filteredEnquiries.slice(start, start + enquiryPageSize);
  }, [filteredEnquiries, currentEnquiryPage, enquiryPageSize]);

  // --- Filtered Projects ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = projectSearch.toLowerCase();
      const matchesSearch = 
        (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.technologies || []).some(t => t.toLowerCase().includes(q));

      const matchesCat = 
        projectCategoryFilter === 'All' || 
        p.category.toLowerCase() === projectCategoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [projects, projectSearch, projectCategoryFilter]);

  // Paginated Projects
  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / projectPageSize));
  const currentProjectPage = Math.min(projectPage, totalProjectPages);
  const paginatedProjects = useMemo(() => {
    const start = (currentProjectPage - 1) * projectPageSize;
    return filteredProjects.slice(start, start + projectPageSize);
  }, [filteredProjects, currentProjectPage, projectPageSize]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await onUpdateStatus(id, newStatus);
    onNotify(`Updated enquiry status to "${newStatus}"`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      await onDeleteInquiry(id);
      onNotify('Enquiry deleted successfully.');
    }
  };

  const projectCategories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  return (
    <div className="space-y-6 animate-fade-in text-xs text-[#0F172A]">
      
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Total Enquiries Card */}
        <div 
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              Manage Enquiries
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight">
              {metrics.totalEnquiries}
            </div>
            <div className="text-xs font-semibold text-[#475569] mt-0.5">Total Enquiries</div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-[#2563EB] font-bold">
              <Clock className="w-3.5 h-3.5" />
              {metrics.newEnquiries} New Leads
            </span>
            <span>{metrics.completedEnquiries} Closed</span>
          </div>
        </div>

        {/* Total Projects Card */}
        <div 
          onClick={() => onNavigateTab('portfolio')}
          className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
              Portfolio
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight">
              {metrics.totalProjects}
            </div>
            <div className="text-xs font-semibold text-[#475569] mt-0.5">Total Projects</div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-[#16A34A] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {metrics.featuredProjects} Featured
            </span>
            <span>Published Works</span>
          </div>
        </div>

        {/* Total Services Card */}
        <div 
          onClick={() => onNavigateTab('services')}
          className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FAF5FF] text-[#9333EA] group-hover:bg-[#9333EA] group-hover:text-white transition-colors">
              Services
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight">
              {metrics.totalServices}
            </div>
            <div className="text-xs font-semibold text-[#475569] mt-0.5">Total Services</div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-[#9333EA] font-bold">
              <Layers className="w-3.5 h-3.5" />
              Active Offerings
            </span>
            <span>Business Packages</span>
          </div>
        </div>

      </div>

      {/* SECTION 1: RECENT ENQUIRIES */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#2563EB]" />
              <span>Recent Enquiries</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono">
                {filteredEnquiries.length}
              </span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Customer enquiries submitted through website forms
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Submissions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search enquiries by name, email, phone..."
              value={enquirySearch}
              onChange={(e) => {
                setEnquirySearch(e.target.value);
                setEnquiryPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-medium placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Filter Dropdown & Page Size */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-semibold">Status:</span>
              <select
                value={enquiryStatusFilter}
                onChange={(e) => {
                  setEnquiryStatusFilter(e.target.value);
                  setEnquiryPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="font-semibold">Show:</span>
              <select
                value={enquiryPageSize}
                onChange={(e) => {
                  setEnquiryPageSize(Number(e.target.value));
                  setEnquiryPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0F172A] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        {paginatedEnquiries.length === 0 ? (
          <div className="py-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
            <Inbox className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#475569]">No enquiries matched your filter.</p>
            <p className="text-[11px] text-[#94A3B8]">Try clearing your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Project Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-[#FFFFFF]">
                {paginatedEnquiries.map((sub) => {
                  const status = (sub.status || 'new').toLowerCase();
                  return (
                    <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                      
                      {/* Date */}
                      <td className="py-3 px-3 text-[#64748B] font-mono whitespace-nowrap">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3 font-bold text-[#0F172A] whitespace-nowrap">
                        {sub.name}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 space-y-0.5 whitespace-nowrap">
                        {sub.email && (
                          <div className="flex items-center gap-1 text-[11px] text-[#475569]">
                            <Mail className="w-3 h-3 text-[#2563EB]" />
                            <a href={`mailto:${sub.email}`} className="hover:underline">{sub.email}</a>
                          </div>
                        )}
                        {sub.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-[#475569]">
                            <Phone className="w-3 h-3 text-[#16A34A]" />
                            <a href={`tel:${sub.phone}`} className="hover:underline">{sub.phone}</a>
                          </div>
                        )}
                      </td>

                      {/* Project Type */}
                      <td className="py-3 px-3 font-semibold text-[#334155] whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                          {sub.project_type || 'General Website Inquiry'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={sub.status || 'new'}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none ${
                            status === 'new' 
                              ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]' 
                              : status === 'contacted' || status === 'in progress'
                              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                              : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiryModal(sub)}
                          className="p-1.5 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors cursor-pointer"
                          title="View Message Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {sub.phone && (
                          <button
                            type="button"
                            onClick={() => openWhatsAppReply(sub.phone, sub.name, sub.project_type || 'Website Inquiry')}
                            className="p-1.5 rounded-lg bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] hover:bg-[#16A34A] hover:text-white transition-colors cursor-pointer"
                            title="Reply via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Enquiries Pagination Bar */}
        {filteredEnquiries.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#64748B]">
            <div>
              Showing <span className="font-bold text-[#0F172A]">{(currentEnquiryPage - 1) * enquiryPageSize + 1}</span> to{' '}
              <span className="font-bold text-[#0F172A]">{Math.min(currentEnquiryPage * enquiryPageSize, filteredEnquiries.length)}</span> of{' '}
              <span className="font-bold text-[#0F172A]">{filteredEnquiries.length}</span> enquiries
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentEnquiryPage <= 1}
                onClick={() => setEnquiryPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="font-bold px-2 py-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[#0F172A]">
                Page {currentEnquiryPage} of {totalEnquiryPages}
              </span>

              <button
                type="button"
                disabled={currentEnquiryPage >= totalEnquiryPages}
                onClick={() => setEnquiryPage(p => Math.min(totalEnquiryPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SECTION 2: RECENT PORTFOLIO UPDATES */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#16A34A]" />
              <span>Recent Portfolio Updates</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[10px] font-mono">
                {filteredProjects.length}
              </span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Portfolio showcase projects published on the website
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('portfolio')}
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Manage All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search projects by title, category, tech..."
              value={projectSearch}
              onChange={(e) => {
                setProjectSearch(e.target.value);
                setProjectPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-medium placeholder-[#94A3B8] focus:outline-none focus:border-[#16A34A]"
            />
          </div>

          {/* Filter Dropdown & Page Size */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Filter className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-semibold">Category:</span>
              <select
                value={projectCategoryFilter}
                onChange={(e) => {
                  setProjectCategoryFilter(e.target.value);
                  setProjectPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#16A34A] cursor-pointer"
              >
                {projectCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="font-semibold">Show:</span>
              <select
                value={projectPageSize}
                onChange={(e) => {
                  setProjectPageSize(Number(e.target.value));
                  setProjectPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] text-xs font-bold text-[#0F172A] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        {paginatedProjects.length === 0 ? (
          <div className="py-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
            <FolderKanban className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#475569]">No portfolio projects matched your filter.</p>
            <p className="text-[11px] text-[#94A3B8]">Try clearing your search query or category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Project Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Tech Stack</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-[#FFFFFF]">
                {paginatedProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Title & Image */}
                    <td className="py-3 px-3 font-bold text-[#0F172A]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden shrink-0 flex items-center justify-center font-bold text-[10px] text-[#64748B]">
                          {p.image && !p.image.startsWith('PLACEHOLDER') ? (
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            p.title.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{p.title}</div>
                          <div className="text-[11px] text-[#64748B] line-clamp-1 max-w-xs">{p.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] font-bold text-[10px]">
                        {p.category}
                      </span>
                    </td>

                    {/* Technologies */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] text-[10px] font-mono">
                            {tech}
                          </span>
                        ))}
                        {p.technologies.length > 3 && (
                          <span className="text-[10px] text-[#94A3B8] font-mono">+{p.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-[10px]">
                          <Sparkles className="w-3 h-3 text-[#D97706]" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#94A3B8]">Standard</span>
                      )}
                    </td>

                    {/* Link */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {p.url && p.url !== '#' ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#94A3B8]">No link</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects Pagination Bar */}
        {filteredProjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#64748B]">
            <div>
              Showing <span className="font-bold text-[#0F172A]">{(currentProjectPage - 1) * projectPageSize + 1}</span> to{' '}
              <span className="font-bold text-[#0F172A]">{Math.min(currentProjectPage * projectPageSize, filteredProjects.length)}</span> of{' '}
              <span className="font-bold text-[#0F172A]">{filteredProjects.length}</span> projects
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentProjectPage <= 1}
                onClick={() => setProjectPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="font-bold px-2 py-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[#0F172A]">
                Page {currentProjectPage} of {totalProjectPages}
              </span>

              <button
                type="button"
                disabled={currentProjectPage >= totalProjectPages}
                onClick={() => setProjectPage(p => Math.min(totalProjectPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Detail View Modal for Enquiries */}
      {selectedEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h4 className="font-extrabold text-[#0F172A] text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#2563EB]" />
                <span>Enquiry Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedEnquiryModal(null)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#64748B] uppercase font-bold text-[10px] block">Customer Name</span>
                <span className="font-extrabold text-[#0F172A] text-sm">{selectedEnquiryModal.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#64748B] uppercase font-bold text-[10px] block">Email</span>
                  <span className="font-bold text-[#2563EB]">{selectedEnquiryModal.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] uppercase font-bold text-[10px] block">Phone</span>
                  <span className="font-bold text-[#16A34A]">{selectedEnquiryModal.phone || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] uppercase font-bold text-[10px] block">Project / Service Requested</span>
                <span className="font-bold text-[#0F172A]">{selectedEnquiryModal.project_type || 'General Website Inquiry'}</span>
              </div>

              <div>
                <span className="text-[#64748B] uppercase font-bold text-[10px] block mb-1">Message</span>
                <p className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[#334155] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiryModal.message || 'No additional message provided.'}
                </p>
              </div>

              <div>
                <span className="text-[#64748B] uppercase font-bold text-[10px] block mb-1">Status</span>
                <select
                  value={selectedEnquiryModal.status || 'new'}
                  onChange={async (e) => {
                    const newSt = e.target.value;
                    setSelectedEnquiryModal({ ...selectedEnquiryModal, status: newSt });
                    await handleStatusChange(selectedEnquiryModal.id, newSt);
                  }}
                  className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-bold text-[#0F172A] cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiryModal(null)}
                className="px-4 py-2 rounded-xl bg-[#F1F5F9] text-[#475569] font-bold text-xs hover:bg-[#E2E8F0] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
