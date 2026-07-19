"use client";

import React from "react";
import { Search, Filter, RotateCcw, Download } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    label?: string;
  }[];
  onReset: () => void;
  onExport?: () => void;
  showExport?: boolean;
  exportLabel?: string;
}

export default function AdminFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onReset,
  onExport,
  showExport = true,
  exportLabel = "Export",
}: AdminFiltersProps) {
  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:outline-none focus:border-[#FF6A00]/50 text-sm text-white placeholder-gray-500"
          />
        </div>

        {/* Filter dropdowns */}
        {filters.map((filter, index) => (
          <div key={index} className="relative w-full sm:w-48 shrink-0">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300 appearance-none cursor-pointer"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        ))}

        {/* Reset button */}
        <button
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
          title="Reset filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export */}
        {showExport && onExport && (
          <button
            onClick={onExport}
            className="px-5 py-2.5 rounded-xl bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border border-[#FF6A00]/20 text-[#FF6A00] transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{exportLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
