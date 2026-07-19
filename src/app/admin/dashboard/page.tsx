"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  AlertCircle,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import type { LeadDbRow, CustomerDbRow, CrmTask, CrmActivity } from "@/types/lead";
import AnimatedBackground from "@/components/AnimatedBackground";
import CrmDetailView from "@/components/CrmDetailView";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminLeadsTab from "@/components/admin/AdminLeadsTab";
import AdminCustomersTab from "@/components/admin/AdminCustomersTab";
import AdminTasksTab from "@/components/admin/AdminTasksTab";
import AdminNotificationsTab from "@/components/admin/AdminNotificationsTab";

type CrmTab = "overview" | "leads" | "customers" | "tasks" | "notifications";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [crmTab, setCrmTab] = useState<CrmTab>("overview");
  const [loading, setLoading] = useState(true);
  const [userEmail, _setUserEmail] = useState("");

  // CRM Data States
  const [leads, setLeads] = useState<LeadDbRow[]>([]);
  const [customers, setCustomers] = useState<CustomerDbRow[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("all");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState("pending");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modals
  const [selectedContact, setSelectedContact] = useState<{ id: string; type: "lead" | "customer" } | null>(null);
  const [convertingLead, setConvertingLead] = useState<LeadDbRow | null>(null);
  const [contractValue, setContractValue] = useState("15000");
  const [editingLead, setEditingLead] = useState<LeadDbRow | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDbRow | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeadDbRow>>({});
  const [editCustomerForm, setEditCustomerForm] = useState<Partial<CustomerDbRow>>({});
  const [deletingLead, setDeletingLead] = useState<LeadDbRow | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerDbRow | null>(null);

  const fetchCrmData = useCallback(async () => {
    setFetching(true);
    setFetchError("");
    try {
      const [resLeads, resCustomers, resTasks, resActivities] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("crm_tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("crm_activities").select("*").order("created_at", { ascending: false }),
      ]);

      if (resLeads.error) throw resLeads.error;
      if (resCustomers.error) throw resCustomers.error;
      if (resTasks.error) throw resTasks.error;
      if (resActivities.error) throw resActivities.error;

      setLeads(resLeads.data ?? []);
      setCustomers(resCustomers.data ?? []);
      setTasks(resTasks.data ?? []);
      setActivities(resActivities.data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load CRM database records.";
      console.error("Error fetching CRM records:", err);
      setFetchError(message);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Convert Lead to Customer
  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    try {
      const cValue = parseFloat(contractValue) || 0;
      const customerObj: Record<string, unknown> = {
        lead_id: convertingLead.id,
        full_name: convertingLead.full_name,
        business_name: convertingLead.business_name,
        email: convertingLead.email,
        phone: convertingLead.phone,
        whatsapp: convertingLead.whatsapp,
        category: convertingLead.category,
        address: convertingLead.address,
        status: "active",
        contract_value: cValue,
        notes: convertingLead.message,
      };

      const { error: custErr } = await supabase.from("customers").insert(customerObj);
      if (custErr) throw custErr;

      const { error: leadErr } = await supabase
        .from("leads")
        .update({ status: "converted" })
        .eq("id", convertingLead.id);
      if (leadErr) throw leadErr;

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("crm_activities").insert({
        lead_id: convertingLead.id,
        activity_type: "converted",
        description: `Lead converted to active Customer: "${convertingLead.full_name}" (Contract Value: ₹${cValue.toLocaleString("en-IN")})`,
        created_by: user?.id ?? null,
      });

      setConvertingLead(null);
      await fetchCrmData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Conversion failed: " + message);
    }
  };

  // Delete operations
  const confirmDeleteLead = async () => {
    if (!deletingLead) return;
    try {
      await supabase.from("leads").delete().eq("id", deletingLead.id);
      setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
      setDeletingLead(null);
    } catch (err: unknown) {
      alert("Failed to delete lead: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const confirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    try {
      await supabase.from("customers").delete().eq("id", deletingCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
    } catch (err: unknown) {
      alert("Failed to delete customer: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Toggle task status
  const handleToggleTaskStatus = async (task: CrmTask) => {
    const nextStatus: "pending" | "completed" = task.status === "completed" ? "pending" : "completed";
    try {
      await supabase.from("crm_tasks").update({ status: nextStatus }).eq("id", task.id);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("crm_activities").insert({
        lead_id: task.lead_id,
        customer_id: task.customer_id,
        activity_type: "task_completed",
        description: `Task status updated to ${nextStatus}: "${task.title}"`,
        created_by: user?.id ?? null,
      });
    } catch (err: unknown) {
      alert("Failed to toggle task: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Save edits
  const saveLeadEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    try {
      await supabase.from("leads").update({
        full_name: editForm.full_name?.trim(),
        business_name: editForm.business_name?.trim(),
        email: editForm.email?.trim() ?? null,
        phone: editForm.phone?.trim(),
        whatsapp: editForm.whatsapp?.trim() ?? null,
        gender: editForm.gender,
        category: editForm.category?.trim() ?? null,
        address: editForm.address?.trim() ?? null,
        gbp_available: editForm.gbp_available,
        website_available: editForm.website_available,
        instagram: editForm.instagram?.trim() ?? null,
        facebook: editForm.facebook?.trim() ?? null,
        services_interested: editForm.services_interested ?? [],
        message: editForm.message?.trim() ?? null,
        status: editForm.status,
      }).eq("id", editingLead.id);

      setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? { ...l, ...editForm } as LeadDbRow : l)));
      setEditingLead(null);
    } catch (err: unknown) {
      alert("Failed to update lead: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const saveCustomerEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      await supabase.from("customers").update({
        full_name: editCustomerForm.full_name?.trim(),
        business_name: editCustomerForm.business_name?.trim(),
        email: editCustomerForm.email?.trim() ?? null,
        phone: editCustomerForm.phone?.trim(),
        whatsapp: editCustomerForm.whatsapp?.trim() ?? null,
        category: editCustomerForm.category?.trim() ?? null,
        address: editCustomerForm.address?.trim() ?? null,
        status: editCustomerForm.status,
        contract_value: parseFloat(String(editCustomerForm.contract_value)) || 0,
        notes: editCustomerForm.notes?.trim() ?? null,
      }).eq("id", editingCustomer.id);

      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...editCustomerForm } as CustomerDbRow : c)));
      setEditingCustomer(null);
    } catch (err: unknown) {
      alert("Failed to update customer: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleEditCheckboxToggle = (service: string) => {
    setEditForm((prev) => {
      const services = prev.services_interested ?? [];
      return {
        ...prev,
        services_interested: services.includes(service)
          ? services.filter((s) => s !== service)
          : [...services, service],
      };
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCustomerStatusFilter("all");
    setTaskPriorityFilter("all");
    setTaskStatusFilter("pending");
    setCurrentPage(1);
  };

  // Derived data
  const activeLeadsCount = leads.filter((l) => l.status !== "converted" && l.status !== "lost").length;
  const activeCustomersCount = customers.filter((c) => c.status === "active").length;
  const totalContractVal = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + (c.contract_value || 0), 0);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const overdueTasks = pendingTasks.filter((t) => t.due_date && new Date(t.due_date) < new Date());
  const dueTodayTasks = pendingTasks.filter(
    (t) => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()
  );
  const newLeads = leads.filter((l) => l.status === "new");
  const alertCount = overdueTasks.length + dueTodayTasks.length + newLeads.length;

  // Filter functions
  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (lead.full_name ?? "").toLowerCase().includes(search) ||
      (lead.business_name ?? "").toLowerCase().includes(search) ||
      (lead.phone ?? "").toLowerCase().includes(search) ||
      (lead.email ?? "").toLowerCase().includes(search) ||
      (lead.category ?? "").toLowerCase().includes(search);
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter((cust) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (cust.full_name ?? "").toLowerCase().includes(search) ||
      (cust.business_name ?? "").toLowerCase().includes(search) ||
      (cust.phone ?? "").toLowerCase().includes(search) ||
      (cust.email ?? "").toLowerCase().includes(search) ||
      (cust.category ?? "").toLowerCase().includes(search);
    const matchesStatus = customerStatusFilter === "all" || cust.status === customerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();
    const lead = leads.find((l) => l.id === task.lead_id);
    const customer = customers.find((c) => c.id === task.customer_id);
    const contactName = lead?.full_name ?? customer?.full_name ?? "";
    const bName = lead?.business_name ?? customer?.business_name ?? "";
    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      contactName.toLowerCase().includes(search) ||
      bName.toLowerCase().includes(search);
    const matchesPriority = taskPriorityFilter === "all" || task.priority === taskPriorityFilter;
    const matchesStatus = taskStatusFilter === "all" || task.status === taskStatusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Pagination
  const activeListLength =
    crmTab === "leads" ? filteredLeads.length :
    crmTab === "customers" ? filteredCustomers.length :
    filteredTasks.length;
  const totalPages = Math.ceil(activeListLength / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  // Reset pagination when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, statusFilter, customerStatusFilter, taskPriorityFilter, taskStatusFilter, crmTab]);

  // CSV Export
  const exportCSV = (type: "leads" | "customers") => {
    const headers =
      type === "leads"
        ? ["Created At", "Name", "Business", "Email", "Phone", "WhatsApp", "Category", "Address", "Status", "Services Interested"]
        : ["Created At", "Name", "Business", "Email", "Phone", "WhatsApp", "Category", "Status", "Contract Value"];

    const list = type === "leads" ? filteredLeads : filteredCustomers;
    const rows = list.map((item) => {
      if (type === "leads") {
        const lead = item as LeadDbRow;
        return [
          lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
          lead.full_name ?? "",
          lead.business_name ?? "",
          lead.email ?? "",
          lead.phone ?? "",
          lead.whatsapp ?? "",
          lead.category ?? "",
          lead.address ?? "",
          lead.status ?? "",
          (lead.services_interested ?? []).join("; "),
        ];
      }
      const cust = item as CustomerDbRow;
      return [
        cust.created_at ? new Date(cust.created_at).toLocaleString() : "",
        cust.full_name ?? "",
        cust.business_name ?? "",
        cust.email ?? "",
        cust.phone ?? "",
        cust.whatsapp ?? "",
        cust.category ?? "",
        cust.status ?? "",
        cust.contract_value || 0,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `logor_${type}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] relative text-white">
        <AnimatedBackground />
        <div className="flex flex-col lg:flex-row flex-grow relative z-10">
          <aside className="w-full lg:w-64 bg-charcoal-deep border-b lg:border-b-0 lg:border-r border-white/5 p-6 shrink-0">
            <div className="space-y-8">
              <div className="h-7 w-24 bg-white/[0.03] rounded-lg animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-grow">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-gray-100 font-sans relative">
      <AnimatedBackground />

      <div className="flex flex-col lg:flex-row flex-grow relative z-10">
        <AdminSidebar
          crmTab={crmTab}
          setCrmTab={setCrmTab}
          activeLeadsCount={activeLeadsCount}
          activeCustomersCount={activeCustomersCount}
          pendingTasksCount={pendingTasks.length}
          alertCount={alertCount}
          userEmail={userEmail}
          handleLogout={handleLogout}
        />

        <div className="flex-grow flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 glass-navbar py-4 px-6 flex items-center justify-between lg:hidden shrink-0">
            <div className="flex items-center gap-3">
              <Image src="/logor-logo.png" alt="Logor" width={80} height={28} className="h-6 w-auto" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">CRM</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </header>

          <main className="flex-grow p-6 sm:p-8 overflow-y-auto space-y-8">
            {fetchError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            {crmTab === "overview" && (
              <AdminDashboardOverview
                leads={leads}
                customers={customers}
                tasks={tasks}
                activities={activities}
                activeLeadsCount={activeLeadsCount}
                activeCustomersCount={activeCustomersCount}
                totalContractVal={totalContractVal}
                pendingTasks={pendingTasks}
                overdueTasks={overdueTasks}
                dueTodayTasks={dueTodayTasks}
                newLeadsCount={newLeads.length}
                setCrmTab={setCrmTab}
              />
            )}

            {crmTab === "leads" && (
              <AdminLeadsTab
                leads={leads}
                filteredLeads={filteredLeads}
                paginatedLeads={paginatedLeads}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                fetching={fetching}
                resetFilters={resetFilters}
                exportCSV={exportCSV}
                setSelectedContact={setSelectedContact}
                setConvertingLead={setConvertingLead}
                setEditingLead={setEditingLead}
                setEditForm={setEditForm}
                setDeletingLead={setDeletingLead}
                setCurrentPage={setCurrentPage}
              />
            )}

            {crmTab === "customers" && (
              <AdminCustomersTab
                customers={customers}
                filteredCustomers={filteredCustomers}
                paginatedCustomers={paginatedCustomers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                customerStatusFilter={customerStatusFilter}
                setCustomerStatusFilter={setCustomerStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                fetching={fetching}
                resetFilters={resetFilters}
                exportCSV={exportCSV}
                setSelectedContact={setSelectedContact}
                setEditingCustomer={setEditingCustomer}
                setEditCustomerForm={setEditCustomerForm}
                setDeletingCustomer={setDeletingCustomer}
                setCurrentPage={setCurrentPage}
              />
            )}

            {crmTab === "tasks" && (
              <AdminTasksTab
                tasks={tasks}
                filteredTasks={filteredTasks}
                paginatedTasks={paginatedTasks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                taskStatusFilter={taskStatusFilter}
                setTaskStatusFilter={setTaskStatusFilter}
                taskPriorityFilter={taskPriorityFilter}
                setTaskPriorityFilter={setTaskPriorityFilter}
                fetching={fetching}
                resetFilters={resetFilters}
                handleToggleTaskStatus={handleToggleTaskStatus}
                setSelectedContact={setSelectedContact}
                leads={leads}
                customers={customers}
              />
            )}

            {crmTab === "notifications" && (
              <AdminNotificationsTab
                overdueTasks={overdueTasks}
                dueTodayTasks={dueTodayTasks}
                newLeads={newLeads}
                alertCount={alertCount}
                leads={leads}
                customers={customers}
                setSelectedContact={setSelectedContact}
              />
            )}
          </main>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      <CrmDetailView
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        entityType={selectedContact?.type ?? "lead"}
        entityId={selectedContact?.id ?? null}
        onUpdate={fetchCrmData}
      />

      {/* ─── MODALS ─── */}

      {/* Convert Lead Modal */}
      <AnimatePresence>
        {convertingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConvertingLead(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md glass-panel border border-white/5 rounded-3xl p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-white">Convert to Customer</h3>
                <button onClick={() => setConvertingLead(null)} className="p-2 rounded-lg text-gray-400 hover:text-white bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleConvertLead} className="space-y-5">
                <div className="space-y-3 text-sm text-gray-300 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <p><span className="text-gray-500">Name:</span> {convertingLead.full_name}</p>
                  <p><span className="text-gray-500">Business:</span> {convertingLead.business_name}</p>
                  <p><span className="text-gray-500">Phone:</span> {convertingLead.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white focus:outline-none focus:border-[#FF6A00]/50"
                    placeholder="Enter contract amount"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Confirm & Convert</span>
                  </div>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingLead(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg glass-panel border border-white/5 rounded-3xl p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-white">Edit Lead</h3>
                <button onClick={() => setEditingLead(null)} className="p-2 rounded-lg text-gray-400 hover:text-white bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={saveLeadEdits} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Full Name" value={editForm.full_name ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, full_name: v }))} />
                  <InputField label="Business Name" value={editForm.business_name ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, business_name: v }))} />
                </div>
                <InputField label="Phone" value={editForm.phone ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, phone: v }))} />
                <InputField label="Email" value={editForm.email ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, email: v }))} />
                <InputField label="WhatsApp" value={editForm.whatsapp ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, whatsapp: v }))} />
                <InputField label="Category" value={editForm.category ?? ""} onChange={(v) => setEditForm((p) => ({ ...p, category: v }))} />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as LeadDbRow["status"] }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Services</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {["NFC Business Cards", "Digital Landing Pages", "Google Business Profile Setup", "QR Code Solutions", "Google Review Solutions", "WhatsApp Business Integration", "Online Reputation Management", "Search Engine Optimization"].map(
                      (service) => (
                        <label key={service} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.services_interested?.includes(service) ?? false}
                            onChange={() => handleEditCheckboxToggle(service)}
                            className="accent-[#FF6A00]"
                          />
                          {service}
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#FF6A00] text-black font-bold text-sm hover:bg-[#FF8833] transition-all">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setEditingLead(null)} className="py-2.5 px-6 rounded-xl border border-white/5 text-gray-400 text-sm font-semibold hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCustomer(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg glass-panel border border-white/5 rounded-3xl p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-white">Edit Customer</h3>
                <button onClick={() => setEditingCustomer(null)} className="p-2 rounded-lg text-gray-400 hover:text-white bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={saveCustomerEdits} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Full Name" value={editCustomerForm.full_name ?? ""} onChange={(v) => setEditCustomerForm((p) => ({ ...p, full_name: v }))} />
                  <InputField label="Business Name" value={editCustomerForm.business_name ?? ""} onChange={(v) => setEditCustomerForm((p) => ({ ...p, business_name: v }))} />
                </div>
                <InputField label="Phone" value={editCustomerForm.phone ?? ""} onChange={(v) => setEditCustomerForm((p) => ({ ...p, phone: v }))} />
                <InputField label="Email" value={editCustomerForm.email ?? ""} onChange={(v) => setEditCustomerForm((p) => ({ ...p, email: v }))} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400">Status</label>
                    <select
                      value={editCustomerForm.status}
                      onChange={(e) => setEditCustomerForm((p) => ({ ...p, status: e.target.value as CustomerDbRow["status"] }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="churned">Churned</option>
                    </select>
                  </div>
                  <InputField label="Contract Value (₹)" type="number" value={String(editCustomerForm.contract_value ?? 0)} onChange={(v) => setEditCustomerForm((p) => ({ ...p, contract_value: parseFloat(v) || 0 }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Notes</label>
                  <textarea
                    value={editCustomerForm.notes ?? ""}
                    onChange={(e) => setEditCustomerForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white focus:outline-none focus:border-[#FF6A00]/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#FF6A00] text-black font-bold text-sm hover:bg-[#FF8833] transition-all">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setEditingCustomer(null)} className="py-2.5 px-6 rounded-xl border border-white/5 text-gray-400 text-sm font-semibold hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modals */}
      <AnimatePresence>
        {deletingLead && (
          <ConfirmDelete
            message={`Are you sure you want to delete the lead "${deletingLead.full_name}"? This action cannot be undone.`}
            onConfirm={confirmDeleteLead}
            onCancel={() => setDeletingLead(null)}
          />
        )}
        {deletingCustomer && (
          <ConfirmDelete
            message={`Are you sure you want to delete the customer "${deletingCustomer.full_name}"? This action cannot be undone.`}
            onConfirm={confirmDeleteCustomer}
            onCancel={() => setDeletingCustomer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Shared small components
function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white focus:outline-none focus:border-[#FF6A00]/50"
      />
    </div>
  );
}

function ConfirmDelete({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm glass-panel border border-white/5 rounded-3xl p-8 shadow-2xl z-10 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-3">Confirm Delete</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all">
            Delete
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/5 text-gray-400 text-sm font-semibold hover:bg-white/5 transition-all">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
