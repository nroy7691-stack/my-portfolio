import React from 'react';
import { Users, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { SubmissionMetrics } from './adminUtils';

interface AdminMetricsOverviewProps {
  metrics: SubmissionMetrics;
}

export const AdminMetricsOverview: React.FC<AdminMetricsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
        <div className="flex items-center justify-between text-[#475569] text-xs font-medium">
          <span>Total Inquiries</span>
          <Users className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div className="text-2xl font-extrabold text-[#0F172A]">{metrics.totalCount}</div>
        <div className="text-[10px] text-[#64748B]">Recorded in database</div>
      </div>

      <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-1">
        <div className="flex items-center justify-between text-[#2563EB] text-xs font-medium">
          <span>New Leads</span>
          <Clock className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div className="text-2xl font-extrabold text-[#2563EB]">{metrics.newCount}</div>
        <div className="text-[10px] text-[#2563EB]/80">Awaiting follow-up</div>
      </div>

      <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] space-y-1">
        <div className="flex items-center justify-between text-[#D97706] text-xs font-medium">
          <span>In Progress</span>
          <TrendingUp className="w-4 h-4 text-[#D97706]" />
        </div>
        <div className="text-2xl font-extrabold text-[#B45309]">{metrics.inProgressCount}</div>
        <div className="text-[10px] text-[#B45309]/80">Contacted / Negotiating</div>
      </div>

      <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
        <div className="flex items-center justify-between text-[#059669] text-xs font-medium">
          <span>Completed</span>
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
        </div>
        <div className="text-2xl font-extrabold text-[#047857]">{metrics.completedCount}</div>
        <div className="text-[10px] text-[#047857]/80">Deals closed successfully</div>
      </div>
    </div>
  );
};
