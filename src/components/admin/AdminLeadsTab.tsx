"use client";

import React from "react";
import {
  Edit2,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";
import type { LeadDbRow } from "@/types/lead";
import AdminFilters from "./AdminFilters";
import AdminPagination from "./AdminPagination";

const statusOptions: { value: LeadDbRow["status"]; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "contacted", label: "Contacted", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "converted", label: "Converted", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "lost", label: "Lost", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
];

interface AdminLeadsTabProps {
  leads: LeadDbRow[];
  filteredLeads: LeadDbRow[];
  paginatedLeads: LeadDbRow[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  currentPage: number;
  totalPages: number;
  fetching: boolean;
  resetFilters: () => void;
  exportCSV: (type: "leads" | "customers") => void;
  setSelectedContact: (contact: { id: string; type: "lead" | "customer" } | null) => void;
  setConvertingLead: (lead: LeadDbRow | null) => void;
  setEditingLead: (lead: LeadDbRow | null) => void;
  setEditForm: (form: Partial<LeadDbRow>) => void;
  setDeletingLead: (lead: LeadDbRow | null) => void;
  setCurrentPage: (page: number) => void;
}

export default function AdminLeadsTab({
  leads: _leads,
  filteredLeads,
  paginatedLeads,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  totalPages,
  fetching,
  resetFilters,
  exportCSV,
  setSelectedContact,
  setConvertingLead,
  setEditingLead,
  setEditForm,
  setDeletingLead,
  setCurrentPage,
}: AdminLeadsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Leads</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage raw web inquiries, schedule tasks, and convert prospects.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search leads by name, business, category..."
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "all", label: "All Inquiries" },
              { value: "new", label: "New" },
              { value: "contacted", label: "Contacted" },
              { value: "converted", label: "Converted" },
              { value: "lost", label: "Lost" },
            ],
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportCSV("leads")}
      />

      {/* Table */}
      <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Name / Business</th>
                <th className="py-4 px-6">Contacts</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {fetching ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6A00] mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    No matching leads found.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const statusConfig = statusOptions.find((o) => o.value === lead.status) || {
                    label: lead.status || "Unknown",
                    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
                  };

                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-5 px-6 font-mono text-xs text-gray-500">
                        {lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString("en-IN")
                          : ""}
                      </td>
                      <td
                        className="py-5 px-6 cursor-pointer"
                        onClick={() => setSelectedContact({ id: lead.id, type: "lead" })}
                      >
                        <div className="font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                          {lead.full_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {lead.business_name}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-xs text-gray-400 space-y-0.5">
                        <div>{lead.phone}</div>
                        {lead.email && (
                          <div className="text-[10px] text-gray-500 font-mono">{lead.email}</div>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {lead.status !== "converted" && (
                            <button
                              onClick={() => setConvertingLead(lead)}
                              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Convert to Customer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Convert</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setEditForm({ ...lead });
                            }}
                            className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingLead(lead)}
                            className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-gray-600 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLeads.length}
          onPageChange={setCurrentPage}
          itemLabel="total leads"
        />
      </div>
    </div>
  );
}
