import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Database,
  ExternalLink,
  LogOut,
  Inbox,
  FolderKanban,
  Sparkles,
  Wrench,
  User,
  MessageSquareQuote,
  PhoneCall,
  Globe,
  Palette,
  LayoutDashboard
} from 'lucide-react';

import { 
  getCustomerSubmissions, 
  updateInquiryStatus, 
  deleteInquiry, 
  CustomerSubmission 
} from '../lib/supabase';
import { 
  calculateMetrics, 
  filterSubmissions, 
  exportSubmissionsToCSV 
} from './admin/adminUtils';
import { AdminAuthView } from './admin/AdminAuthView';
import { AdminMetricsOverview } from './admin/AdminMetricsOverview';
import { AdminControlsBar } from './admin/AdminControlsBar';
import { AdminSubmissionsTable } from './admin/AdminSubmissionsTable';
import { AdminPortfolioManager } from './admin/AdminPortfolioManager';
import { AdminHeroManager } from './admin/AdminHeroManager';
import { AdminServicesManager } from './admin/AdminServicesManager';
import { AdminAboutManager } from './admin/AdminAboutManager';
import { AdminTestimonialsManager } from './admin/AdminTestimonialsManager';
import { AdminContactManager } from './admin/AdminContactManager';
import { AdminWebsiteManager } from './admin/AdminWebsiteManager';
import { AdminThemeManager } from './admin/AdminThemeManager';
import { AdminDashboard } from './admin/AdminDashboard';
import { getStoredProjects, Project } from '../data/portfolioData';
import { getStoredServices, ServiceItem } from '../data/servicesData';
import { getStoredTestimonials } from '../data/testimonialsData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('enjel_admin_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'portfolio' | 'services' | 'testimonials' | 'about' | 'hero' | 'contact' | 'website' | 'theme'>('dashboard');

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [submissions, setSubmissions] = useState<CustomerSubmission[]>([]);
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [services, setServices] = useState<ServiceItem[]>(getStoredServices);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Default Passcode is 'admin123'
  const CORRECT_PASSCODE = 'admin123';

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSubmissions();
      setProjects(getStoredProjects());
      setServices(getStoredServices());
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    const handlePortfolioUpdate = () => setProjects(getStoredProjects());
    const handleServicesUpdate = () => setServices(getStoredServices());
    window.addEventListener('portfolio_updated', handlePortfolioUpdate);
    window.addEventListener('services_updated', handleServicesUpdate);
    return () => {
      window.removeEventListener('portfolio_updated', handlePortfolioUpdate);
      window.removeEventListener('services_updated', handleServicesUpdate);
    };
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const data = await getCustomerSubmissions();
    setSubmissions(data);
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === CORRECT_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem('enjel_admin_auth', 'true');
      setPasscodeError(false);
      setPasscode('');
      fetchSubmissions();
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('enjel_admin_auth');
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await updateInquiryStatus(id, newStatus);
    if (success) {
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub)
      );
      showToast('Status updated successfully');
    } else {
      showToast('Failed to update status in Supabase');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) {
      return;
    }
    const success = await deleteInquiry(id);
    if (success) {
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      showToast('Inquiry deleted from database');
    } else {
      showToast('Failed to delete inquiry');
    }
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleExportCSV = () => {
    exportSubmissionsToCSV(submissions);
  };

  // Filtered List & Metrics
  const filteredSubmissions = filterSubmissions(submissions, searchQuery, selectedStatusFilter);
  const metrics = calculateMetrics(submissions);
  const portfolioCount = getStoredProjects().length;
  const servicesCount = getStoredServices().length;
  const testimonialsCount = getStoredTestimonials().length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F172A]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-[#FFFFFF] border border-[#E2E8F0] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#0F172A]">Enjel Web Design Admin Panel</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-[10px] font-mono font-semibold">
                  Supabase DB
                </span>
              </div>
              <p className="text-xs text-[#475569] font-mono">
                Project: vgtvzesvjtioyvzbijfn • Table: public.submissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center gap-1.5 font-medium cursor-pointer"
                title="Lock Admin Panel"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (when authenticated) */}
        {isAuthenticated && (
          <div className="px-4 pt-3 pb-0 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer shrink-0 ${
                activeTab === 'inquiries'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inquiries & Submissions</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Portfolio Management</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono">
                {portfolioCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Services Management</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono">
                {servicesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Testimonials</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono">
                {testimonialsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>About Section</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Info</span>
            </button>

            <button
              onClick={() => setActiveTab('website')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'website'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-l border-r cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#2563EB] shadow-sm -mb-px'
                  : 'bg-transparent border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Palette className="w-4 h-4 text-[#2563EB]" />
              <span>Theme Settings</span>
            </button>
          </div>
        )}


        {/* Content Body */}
        {!isAuthenticated ? (
          <AdminAuthView
            passcode={passcode}
            setPasscode={setPasscode}
            passcodeError={passcodeError}
            setPasscodeError={setPasscodeError}
            onLogin={handleLogin}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Success Toast */}
            {actionSuccessMsg && (
              <div className="p-3 px-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  {actionSuccessMsg}
                </span>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <AdminDashboard
                submissions={submissions}
                projects={projects}
                services={services}
                onUpdateStatus={handleStatusChange}
                onDeleteInquiry={handleDelete}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onNotify={showToast}
              />
            )}

            {activeTab === 'inquiries' && (
              <>
                {/* Metrics Overview */}
                <AdminMetricsOverview metrics={metrics} />

                {/* Controls Bar */}
                <AdminControlsBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStatusFilter={selectedStatusFilter}
                  setSelectedStatusFilter={setSelectedStatusFilter}
                  isLoading={isLoading}
                  onRefresh={fetchSubmissions}
                  onExportCSV={handleExportCSV}
                  hasSubmissions={submissions.length > 0}
                />

                {/* Submissions Table */}
                <AdminSubmissionsTable
                  isLoading={isLoading}
                  submissions={filteredSubmissions}
                  searchQuery={searchQuery}
                  selectedStatusFilter={selectedStatusFilter}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />

                {/* Supabase Deep Link Notice */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#2563EB]" />
                    <span>
                      Supabase Project ID: <code className="font-mono text-[#0F172A] font-bold">vgtvzesvjtioyvzbijfn</code>
                    </span>
                  </div>
                  <a
                    href="https://supabase.com/dashboard/project/vgtvzesvjtioyvzbijfn/editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#2563EB] hover:underline font-semibold"
                  >
                    <span>Open Supabase Web Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            )}

            {activeTab === 'portfolio' && (
              <AdminPortfolioManager onNotify={showToast} />
            )}

            {activeTab === 'services' && (
              <AdminServicesManager onNotify={showToast} />
            )}

            {activeTab === 'testimonials' && (
              <AdminTestimonialsManager onNotify={showToast} />
            )}

            {activeTab === 'about' && (
              <AdminAboutManager onNotify={showToast} />
            )}

            {activeTab === 'hero' && (
              <AdminHeroManager onNotify={showToast} />
            )}

            {activeTab === 'contact' && (
              <AdminContactManager onNotify={showToast} />
            )}

            {activeTab === 'website' && (
              <AdminWebsiteManager onNotify={showToast} />
            )}

            {activeTab === 'theme' && (
              <AdminThemeManager onNotify={showToast} />
            )}
          </div>
        )}


        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
          <span className="font-mono">
            Enjel Web Design Admin • Version 1.1
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F172A] text-white font-semibold hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

