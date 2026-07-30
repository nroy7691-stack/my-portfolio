import { CustomerSubmission } from '../../lib/supabase';
import { siteConfig } from '../../config/siteConfig';

export interface SubmissionMetrics {
  totalCount: number;
  newCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const calculateMetrics = (submissions: CustomerSubmission[]): SubmissionMetrics => {
  const totalCount = submissions.length;
  const newCount = submissions.filter(s => (s.status || 'new').toLowerCase() === 'new').length;
  const inProgressCount = submissions.filter(s => 
    (s.status || '').toLowerCase() === 'in progress' || 
    (s.status || '').toLowerCase() === 'contacted'
  ).length;
  const completedCount = submissions.filter(s => (s.status || '').toLowerCase() === 'completed').length;

  return { totalCount, newCount, inProgressCount, completedCount };
};

export const filterSubmissions = (
  submissions: CustomerSubmission[],
  searchQuery: string,
  selectedStatusFilter: string
): CustomerSubmission[] => {
  return submissions.filter(sub => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (sub.name || '').toLowerCase().includes(query) ||
      (sub.email || '').toLowerCase().includes(query) ||
      (sub.phone || '').toLowerCase().includes(query) ||
      (sub.project_type || '').toLowerCase().includes(query) ||
      (sub.message || '').toLowerCase().includes(query);

    const matchesStatus = 
      selectedStatusFilter === 'All' || 
      (sub.status || 'new').toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
};

export const openWhatsAppReply = (phone: string, name: string, projectType: string) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Hi ${name}, thank you for inquiring about ${projectType} with ${siteConfig.brandName}. I'd love to discuss your website project!`;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const exportSubmissionsToCSV = (submissions: CustomerSubmission[]) => {
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
