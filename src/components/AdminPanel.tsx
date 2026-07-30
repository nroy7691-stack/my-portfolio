import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  RefreshCw, 
  Database, 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Users,
  TrendingUp,
  KeyRound,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';
import { 
  getCustomerSubmissions, 
  updateInquiryStatus, 
  deleteInquiry, 
  CustomerSubmission,
  supabase 
} from '../lib/supabase';
import { siteConfig } from '../config/siteConfig';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('enjel_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [submissions, setSubmissions] = useState<CustomerSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Default Passcode is 'admin123'
  const CORRECT_PASSCODE = 'admin123';

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSubmissions();
    }
  }, [isOpen, isAuthenticated]);

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

  const openWhatsAppReply = (phone: string, name: string, projectType: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = `Hi ${name}, thank you for inquiring about ${projectType} with ${siteConfig.brandName}. I'd love to discuss your website project!`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Project Type', 'Status', 'Message'];
    const rows = submissions.map(sub => [
      `"${sub.id || ''}"`,
      `"${sub.created_at ? new Date(sub.created_at).toLocaleString() : ''}"`,
      `"${(sub.name || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${(sub.phone || '').replace(/"/g, '""')}"`,
      `"${(sub.project_type || '').replace(/"/g, '""')}"`,
      `"${sub.status || 'new'}"`,
      `"${(sub.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      (sub.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.project_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      selectedStatusFilter === 'All' || 
      (sub.status || 'new').toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalCount = submissions.length;
  const newCount = submissions.filter(s => (s.status || 'new').toLowerCase() === 'new').length;
  const inProgressCount = submissions.filter(s => (s.status || '').toLowerCase() === 'in progress' || (s.status || '').toLowerCase() === 'contacted').length;
  const completedCount = submissions.filter(s => (s.status || '').toLowerCase() === 'completed').length;

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
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
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
                className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center gap-1.5 font-medium"
                title="Lock Admin Panel"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Passcode View */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#0F172A]">Admin Access Required</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Enter your security passcode to access customer inquiry records and Supabase database controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode (default: admin123)"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-center text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none transition-colors font-mono tracking-widest ${
                    passcodeError ? 'border-red-500 bg-red-50/50' : 'border-[#E2E8F0] focus:border-[#2563EB]'
                  }`}
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    Incorrect passcode. Try <code className="font-bold">admin123</code>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-[#F8FBFF] border border-[#DBEAFE] text-left text-xs text-[#475569] space-y-1">
              <span className="text-[#2563EB] font-bold block">💡 Default Passcode Info:</span>
              <p>
                The default system passcode is <code className="bg-[#EFF6FF] px-1.5 py-0.5 rounded font-mono text-[#2563EB] font-bold">admin123</code>.
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
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

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between text-[#475569] text-xs font-medium">
                  <span>Total Inquiries</span>
                  <Users className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F172A]">{totalCount}</div>
                <div className="text-[10px] text-[#64748B]">Recorded in database</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-1">
                <div className="flex items-center justify-between text-[#2563EB] text-xs font-medium">
                  <span>New Leads</span>
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="text-2xl font-extrabold text-[#2563EB]">{newCount}</div>
                <div className="text-[10px] text-[#2563EB]/80">Awaiting follow-up</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] space-y-1">
                <div className="flex items-center justify-between text-[#D97706] text-xs font-medium">
                  <span>In Progress</span>
                  <TrendingUp className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="text-2xl font-extrabold text-[#B45309]">{inProgressCount}</div>
                <div className="text-[10px] text-[#B45309]/80">Contacted / Negotiating</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
                <div className="flex items-center justify-between text-[#059669] text-xs font-medium">
                  <span>Completed</span>
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                </div>
                <div className="text-2xl font-extrabold text-[#047857]">{completedCount}</div>
                <div className="text-[10px] text-[#047857]/80">Deals closed successfully</div>
              </div>
            </div>

            {/* Controls Bar: Search, Filter, Export, Refresh */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#64748B] hidden sm:inline" />
                <div className="flex flex-wrap items-center gap-1">
                  {['All', 'New', 'Contacted', 'In Progress', 'Completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedStatusFilter === status 
                          ? 'bg-[#2563EB] text-white font-semibold shadow-sm' 
                          : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchSubmissions}
                  className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Refresh Database Entries"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2563EB]' : ''}`} />
                  <span className="hidden md:inline">Refresh</span>
                </button>

                <button
                  onClick={exportToCSV}
                  disabled={submissions.length === 0}
                  className="p-2 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  title="Export records to CSV file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#FFFFFF] shadow-sm">
              {isLoading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-[#0F172A]">Fetching live data from Supabase...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="py-16 text-center space-y-3 text-[#64748B]">
                  <Database className="w-10 h-10 text-[#CBD5E1] mx-auto" />
                  <p className="text-sm font-bold text-[#0F172A]">No customer inquiries match your filter</p>
                  <p className="text-xs text-[#64748B]">
                    {searchQuery || selectedStatusFilter !== 'All' 
                      ? 'Try clearing your search query or filter settings.' 
                      : 'Test the contact form on your portfolio to see submissions appear here instantly!'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#0F172A]">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Client / Contact</th>
                        <th className="py-3.5 px-4">Project Type</th>
                        <th className="py-3.5 px-4">Message Details</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id || Math.random().toString()} className="hover:bg-[#F8FBFF] transition-colors">
                          
                          {/* Client Info */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-[#0F172A] text-sm">{sub.name}</div>
                            <div className="text-[#64748B] text-[11px] font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-[#2563EB]" />
                              <span>{sub.email}</span>
                            </div>
                            <div className="text-[#64748B] text-[11px] font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-[#10B981]" />
                              <span>{sub.phone}</span>
                            </div>
                          </td>

                          {/* Project Type */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] font-mono font-semibold text-[11px]">
                              {sub.project_type || 'General'}
                            </span>
                          </td>

                          {/* Message */}
                          <td className="py-3.5 px-4 align-top max-w-xs">
                            <div className="text-[#334155] line-clamp-3 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                              {sub.message}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 align-top font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                            {sub.created_at ? new Date(sub.created_at).toLocaleString() : 'Recent'}
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4 align-top">
                            <select
                              value={sub.status || 'new'}
                              onChange={(e) => sub.id && handleStatusChange(sub.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                                (sub.status || 'new').toLowerCase() === 'new' 
                                  ? 'bg-[#EFF6FF] border-[#DBEAFE] text-[#2563EB]'
                                  : (sub.status || '').toLowerCase() === 'contacted'
                                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                                  : (sub.status || '').toLowerCase() === 'in progress'
                                  ? 'bg-[#F3E8FF] border-[#E9D5FF] text-[#7E22CE]'
                                  : (sub.status || '').toLowerCase() === 'completed'
                                  ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
                                  : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#475569]'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Direct Reply */}
                              <button
                                onClick={() => openWhatsAppReply(sub.phone, sub.name, sub.project_type)}
                                className="p-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all font-bold text-xs flex items-center gap-1 shadow-sm"
                                title="Reply directly via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">WhatsApp</span>
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => sub.id && handleDelete(sub.id, sub.name)}
                                className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#94A3B8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

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

          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
          <span className="font-mono">
            Enjel Web Design Admin • Version 1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F172A] text-white font-semibold hover:bg-[#1E293B] transition-colors"
          >
            Close Dashboard
          </button>
        </div>

      </motion.div>
    </div>
  );
};
