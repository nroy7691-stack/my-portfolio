import React from 'react';
import { Search, Filter, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface AdminControlsBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (val: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onExportCSV: () => void;
  hasSubmissions: boolean;
}

export const AdminControlsBar: React.FC<AdminControlsBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatusFilter,
  setSelectedStatusFilter,
  isLoading,
  onRefresh,
  onExportCSV,
  hasSubmissions,
}) => {
  const statusOptions = ['All', 'New', 'Contacted', 'In Progress', 'Completed'];

  return (
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
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
          onClick={onRefresh}
          className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          title="Refresh Database Entries"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2563EB]' : ''}`} />
          <span className="hidden md:inline">Refresh</span>
        </button>

        <button
          onClick={onExportCSV}
          disabled={!hasSubmissions}
          className="p-2 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          title="Export records to CSV file"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
