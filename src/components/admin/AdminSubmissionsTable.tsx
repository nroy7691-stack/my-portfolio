import React from 'react';
import { RefreshCw, Database, Mail, Phone, MessageSquare, Trash2 } from 'lucide-react';
import { CustomerSubmission } from '../../lib/supabase';
import { openWhatsAppReply } from './adminUtils';

interface AdminSubmissionsTableProps {
  isLoading: boolean;
  submissions: CustomerSubmission[];
  searchQuery: string;
  selectedStatusFilter: string;
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const AdminSubmissionsTable: React.FC<AdminSubmissionsTableProps> = ({
  isLoading,
  submissions,
  searchQuery,
  selectedStatusFilter,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#FFFFFF] shadow-sm py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-[#0F172A]">Fetching live data from Supabase...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#FFFFFF] shadow-sm py-16 text-center space-y-3 text-[#64748B]">
        <Database className="w-10 h-10 text-[#CBD5E1] mx-auto" />
        <p className="text-sm font-bold text-[#0F172A]">No customer inquiries match your filter</p>
        <p className="text-xs text-[#64748B]">
          {searchQuery || selectedStatusFilter !== 'All'
            ? 'Try clearing your search query or filter settings.'
            : 'Test the contact form on your portfolio to see submissions appear here instantly!'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#FFFFFF] shadow-sm">
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
            {submissions.map((sub) => (
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
                    onChange={(e) => sub.id && onStatusChange(sub.id, e.target.value)}
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
                      className="p-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                      title="Reply directly via WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">WhatsApp</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => sub.id && onDelete(sub.id, sub.name)}
                      className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#94A3B8] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
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
    </div>
  );
};
