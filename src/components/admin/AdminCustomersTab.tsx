"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { CustomerDbRow } from "@/types/lead";
import AdminFilters from "./AdminFilters";
import AdminPagination from "./AdminPagination";

const customerStatusOptions = [
  { value: "active", label: "Active Client", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "inactive", label: "Inactive", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "churned", label: "Churned", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
];

interface AdminCustomersTabProps {
  customers: CustomerDbRow[];
  filteredCustomers: CustomerDbRow[];
  paginatedCustomers: CustomerDbRow[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  customerStatusFilter: string;
  setCustomerStatusFilter: (val: string) => void;
  currentPage: number;
  totalPages: number;
  fetching: boolean;
  resetFilters: () => void;
  exportCSV: (type: "leads" | "customers") => void;
  setSelectedContact: (contact: { id: string; type: "lead" | "customer" } | null) => void;
  setEditingCustomer: (cust: CustomerDbRow | null) => void;
  setEditCustomerForm: (form: Partial<CustomerDbRow>) => void;
  setDeletingCustomer: (cust: CustomerDbRow | null) => void;
  setCurrentPage: (page: number) => void;
}

export default function AdminCustomersTab({
  customers: _customers,
  filteredCustomers,
  paginatedCustomers,
  searchTerm,
  setSearchTerm,
  customerStatusFilter,
  setCustomerStatusFilter,
  currentPage,
  totalPages,
  fetching,
  resetFilters,
  exportCSV,
  setSelectedContact,
  setEditingCustomer,
  setEditCustomerForm,
  setDeletingCustomer,
  setCurrentPage,
}: AdminCustomersTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Customers</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor closed deals, monthly contracts, and project milestones.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customers..."
        filters={[
          {
            value: customerStatusFilter,
            onChange: setCustomerStatusFilter,
            options: [
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "churned", label: "Churned" },
            ],
          },
        ]}
        onReset={resetFilters}
        onExport={() => exportCSV("customers")}
      />

      {/* Table */}
      <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Name / Business</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Contract Value</th>
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
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    No customer accounts listed.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => {
                  const config = customerStatusOptions.find((o) => o.value === cust.status) || {
                    label: cust.status,
                    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
                  };

                  return (
                    <tr key={cust.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td
                        className="py-5 px-6 cursor-pointer"
                        onClick={() => setSelectedContact({ id: cust.id, type: "customer" })}
                      >
                        <div className="font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                          {cust.full_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{cust.business_name}</div>
                      </td>
                      <td className="py-5 px-6 text-xs text-gray-400">
                        {cust.category || "General"}
                      </td>
                      <td className="py-5 px-6 font-mono text-sm text-[#FF6A00] font-bold">
                        ₹{(cust.contract_value || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingCustomer(cust);
                              setEditCustomerForm({ ...cust });
                            }}
                            className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCustomer(cust)}
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
          totalItems={filteredCustomers.length}
          onPageChange={setCurrentPage}
          itemLabel="total customers"
        />
      </div>
    </div>
  );
}
