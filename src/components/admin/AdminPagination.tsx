"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemLabel = "items",
}: AdminPaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs font-semibold text-gray-400">
      <span className="text-xs text-gray-500">
        Showing {totalItems} {itemLabel}
      </span>
      <div className="flex items-center gap-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
