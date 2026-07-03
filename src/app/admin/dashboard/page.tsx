"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  LogOut,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  TrendingUp,
  Layers,
  X,
  Users,
  CheckCircle2,
  DollarSign,
  Activity,
  Bell,
  CheckSquare,
  ArrowRightLeft,
  Check,
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { LeadDbRow, CustomerDbRow, CrmTask, CrmActivity } from "@/types/lead";
import AnimatedBackground from "@/components/AnimatedBackground";
import CrmDetailView from "@/components/CrmDetailView";

const servicesList = [
  "NFC Business Cards",
  "Digital Landing Pages",
  "Google Business Profile Setup",
  "QR Code Solutions",
  "Google Review Solutions",
  "WhatsApp Business Integration",
  "Online Reputation Management",
  "Search Engine Optimization"
];

const statusOptions: { value: LeadDbRow["status"]; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "contacted", label: "Contacted", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "converted", label: "Converted", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "lost", label: "Lost", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
];

const customerStatusOptions = [
  { value: "active", label: "Active Client", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "inactive", label: "Inactive", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "churned", label: "Churned", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  // Navigation tabs
  const [crmTab, setCrmTab] = useState<"overview" | "leads" | "customers" | "tasks" | "notifications">("overview");

  // Auth States
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

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
  const [serviceFilter, setServiceFilter] = useState("all");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("all");

  // Global Tasks filter states
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState("pending");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit / Delete states
  const [editingLead, setEditingLead] = useState<LeadDbRow | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDbRow | null>(null);
  const [deletingLead, setDeletingLead] = useState<LeadDbRow | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerDbRow | null>(null);

  // Conversion process states
  const [convertingLead, setConvertingLead] = useState<LeadDbRow | null>(null);
  const [contractValue, setContractValue] = useState("15000");

  // Edit Form States
  const [editForm, setEditForm] = useState<Partial<LeadDbRow>>({});
  const [editCustomerForm, setEditCustomerForm] = useState<Partial<CustomerDbRow>>({});

  // Slide-over Details view states
  const [selectedContact, setSelectedContact] = useState<{ id: string; type: "lead" | "customer" } | null>(null);

  // Auth Protection and initial loading
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/admin/");
        } else {
          setUserEmail(session.user?.email || "Admin");
          await fetchCrmData();
        }
      } catch (err) {
        console.error("Auth check dashboard error:", err);
        router.push("/admin/");
      }
    }
    checkAuth();
  }, [router, supabase.auth]);

  const fetchCrmData = async () => {
    setFetching(true);
    setFetchError("");
    try {
      const [resLeads, resCustomers, resTasks, resActivities] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("crm_tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("crm_activities").select("*").order("created_at", { ascending: false })
      ]);

      if (resLeads.error) throw resLeads.error;
      if (resCustomers.error) throw resCustomers.error;
      if (resTasks.error) throw resTasks.error;
      if (resActivities.error) throw resActivities.error;

      setLeads(resLeads.data || []);
      setCustomers(resCustomers.data || []);
      setTasks(resTasks.data || []);
      setActivities(resActivities.data || []);
    } catch (err: any) {
      console.error("Error fetching CRM records:", err);
      setFetchError(err.message || "Failed to load CRM database records.");
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

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
      const customerObj = {
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
        notes: convertingLead.message
      };

      // 1. Insert customer
      const { data: customerData, error: custErr } = await supabase
        .from("customers")
        .insert(customerObj)
        .select()
        .single();

      if (custErr) throw custErr;

      // 2. Update lead status
      const { error: leadErr } = await supabase
        .from("leads")
        .update({ status: "converted" })
        .eq("id", convertingLead.id);

      if (leadErr) throw leadErr;

      // 3. Log Conversion activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("crm_activities").insert({
        lead_id: convertingLead.id,
        activity_type: "converted",
        description: `Lead converted to active Customer: "${convertingLead.full_name}" (Contract Value: ₹${cValue.toLocaleString("en-IN")})`,
        created_by: user?.id || null
      });

      setConvertingLead(null);
      await fetchCrmData();
    } catch (err: any) {
      alert("Conversion failed: " + err.message);
    }
  };

  // Delete lead
  const confirmDeleteLead = async () => {
    if (!deletingLead) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", deletingLead.id);

      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
      setDeletingLead(null);
    } catch (err: any) {
      alert("Failed to delete lead: " + err.message);
    }
  };

  // Delete customer
  const confirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", deletingCustomer.id);

      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
    } catch (err: any) {
      alert("Failed to delete customer: " + err.message);
    }
  };

  // Toggle global task status
  const handleToggleTaskStatus = async (task: CrmTask) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const { error } = await supabase
        .from("crm_tasks")
        .update({ status: nextStatus })
        .eq("id", task.id);

      if (error) throw error;

      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t)));

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("crm_activities").insert({
        lead_id: task.lead_id,
        customer_id: task.customer_id,
        activity_type: "task_completed",
        description: `Task status updated to ${nextStatus}: "${task.title}"`,
        created_by: user?.id || null
      });

      // Update timelines
      await fetchCrmData();
    } catch (err: any) {
      alert("Failed to toggle task: " + err.message);
    }
  };

  // Save Lead edits
  const saveLeadEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    try {
      const { error } = await supabase
        .from("leads")
        .update({
          full_name: editForm.full_name?.trim(),
          business_name: editForm.business_name?.trim(),
          email: editForm.email?.trim() || null,
          phone: editForm.phone?.trim(),
          whatsapp: editForm.whatsapp?.trim() || null,
          gender: editForm.gender,
          category: editForm.category?.trim() || null,
          address: editForm.address?.trim() || null,
          gbp_available: editForm.gbp_available,
          website_available: editForm.website_available,
          instagram: editForm.instagram?.trim() || null,
          facebook: editForm.facebook?.trim() || null,
          services_interested: editForm.services_interested || [],
          message: editForm.message?.trim() || null,
          status: editForm.status
        })
        .eq("id", editingLead.id);

      if (error) throw error;

      setLeads(prev =>
        prev.map(l => (l.id === editingLead.id ? ({ ...l, ...editForm } as LeadDbRow) : l))
      );
      setEditingLead(null);
    } catch (err: any) {
      alert("Failed to update lead: " + err.message);
    }
  };

  // Save Customer edits
  const saveCustomerEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          full_name: editCustomerForm.full_name?.trim(),
          business_name: editCustomerForm.business_name?.trim(),
          email: editCustomerForm.email?.trim() || null,
          phone: editCustomerForm.phone?.trim(),
          whatsapp: editCustomerForm.whatsapp?.trim() || null,
          category: editCustomerForm.category?.trim() || null,
          address: editCustomerForm.address?.trim() || null,
          status: editCustomerForm.status,
          contract_value: parseFloat(String(editCustomerForm.contract_value)) || 0,
          notes: editCustomerForm.notes?.trim() || null
        })
        .eq("id", editingCustomer.id);

      if (error) throw error;

      setCustomers(prev =>
        prev.map(c => (c.id === editingCustomer.id ? ({ ...c, ...editCustomerForm } as CustomerDbRow) : c))
      );
      setEditingCustomer(null);
    } catch (err: any) {
      alert("Failed to update customer: " + err.message);
    }
  };

  const handleEditCheckboxToggle = (service: string) => {
    setEditForm(prev => {
      const services = prev.services_interested || [];
      const updated = services.includes(service)
        ? services.filter(s => s !== service)
        : [...services, service];
      return { ...prev, services_interested: updated };
    });
  };

  // Reset Filters helper
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setCustomerStatusFilter("all");
    setTaskPriorityFilter("all");
    setTaskStatusFilter("pending");
    setCurrentPage(1);
  };

  // Dynamic calculations for overall stats
  const totalLeads = leads.length;
  const activeLeadsCount = leads.filter(l => l.status !== "converted" && l.status !== "lost").length;
  const activeCustomersCount = customers.filter(c => c.status === "active").length;
  const totalContractVal = customers
    .filter(c => c.status === "active")
    .reduce((sum, c) => sum + (c.contract_value || 0), 0);

  // Dynamic alerts/notifications count
  const pendingTasks = tasks.filter(t => t.status === "pending");
  const overdueTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < new Date());
  const dueTodayTasks = pendingTasks.filter(
    t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()
  );
  const newLeads = leads.filter(l => l.status === "new");
  const alertCount = overdueTasks.length + dueTodayTasks.length + newLeads.length;

  // Services distribution
  const serviceCounts: { [key: string]: number } = {};
  leads.forEach(lead => {
    if (lead.services_interested && Array.isArray(lead.services_interested)) {
      lead.services_interested.forEach(service => {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });
    }
  });

  // Filter lists based on tab
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (lead.full_name || "").toLowerCase().includes(searchLower) ||
      (lead.business_name || "").toLowerCase().includes(searchLower) ||
      (lead.phone || "").toLowerCase().includes(searchLower) ||
      (lead.email || "").toLowerCase().includes(searchLower) ||
      (lead.category || "").toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesService =
      serviceFilter === "all" ||
      (lead.services_interested && lead.services_interested.includes(serviceFilter));

    return matchesSearch && matchesStatus && matchesService;
  });

  const filteredCustomers = customers.filter(cust => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (cust.full_name || "").toLowerCase().includes(searchLower) ||
      (cust.business_name || "").toLowerCase().includes(searchLower) ||
      (cust.phone || "").toLowerCase().includes(searchLower) ||
      (cust.email || "").toLowerCase().includes(searchLower) ||
      (cust.category || "").toLowerCase().includes(searchLower);

    const matchesStatus = customerStatusFilter === "all" || cust.status === customerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    // find matching contact info
    const lead = leads.find(l => l.id === task.lead_id);
    const customer = customers.find(c => c.id === task.customer_id);
    const contactName = lead?.full_name || customer?.full_name || "";
    const bName = lead?.business_name || customer?.business_name || "";

    const matchesSearch =
      task.title.toLowerCase().includes(searchLower) ||
      contactName.toLowerCase().includes(searchLower) ||
      bName.toLowerCase().includes(searchLower);

    const matchesPriority = taskPriorityFilter === "all" || task.priority === taskPriorityFilter;
    const matchesStatus = taskStatusFilter === "all" || task.status === taskStatusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Pagination slicing
  const activeListLength =
    crmTab === "leads"
      ? filteredLeads.length
      : crmTab === "customers"
      ? filteredCustomers.length
      : filteredTasks.length;

  const totalPages = Math.ceil(activeListLength / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, serviceFilter, customerStatusFilter, taskPriorityFilter, taskStatusFilter, pageSize, crmTab]);

  // CSV Export for filtered leads/customers
  const exportCSV = (type: "leads" | "customers") => {
    const headers =
      type === "leads"
        ? [
            "Created At",
            "Name",
            "Business",
            "Email",
            "Phone",
            "WhatsApp",
            "Category",
            "Address",
            "Status",
            "Services Interested"
          ]
        : ["Created At", "Name", "Business", "Email", "Phone", "WhatsApp", "Category", "Status", "Contract Value"];

    const list = type === "leads" ? filteredLeads : filteredCustomers;
    const rows = list.map(item => {
      if (type === "leads") {
        const lead = item as LeadDbRow;
        return [
          lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
          lead.full_name || "",
          lead.business_name || "",
          lead.email || "",
          lead.phone || "",
          lead.whatsapp || "",
          lead.category || "",
          lead.address || "",
          lead.status || "",
          (lead.services_interested || []).join("; ")
        ];
      } else {
        const cust = item as CustomerDbRow;
        return [
          cust.created_at ? new Date(cust.created_at).toLocaleString() : "",
          cust.full_name || "",
          cust.business_name || "",
          cust.email || "",
          cust.phone || "",
          cust.whatsapp || "",
          cust.category || "",
          cust.status || "",
          cust.contract_value || 0
        ];
      }
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
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

  const getContactLabel = (taskId: string | null, type: "lead" | "customer") => {
    if (!taskId) return "General CRM Task";
    if (type === "lead") {
      const match = leads.find(l => l.id === taskId);
      return match ? `${match.full_name} (${match.business_name || "Lead"})` : "Unknown Lead";
    } else {
      const match = customers.find(c => c.id === taskId);
      return match ? `${match.full_name} (${match.business_name || "Client"})` : "Unknown Client";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative text-white">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6A00]"></div>
          <p className="text-gray-400 text-sm font-medium">Entering secure area...</p>
        </div>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/6 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 transition-all duration-300";

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-gray-100 font-sans relative">
      <AnimatedBackground />

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row flex-grow relative z-10">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-charcoal-deep border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logor-logo.png"
                  alt="Logor"
                  width={90}
                  height={30}
                  className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </a>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 select-none">
              <button
                onClick={() => setCrmTab("overview")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 ${
                  crmTab === "overview"
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setCrmTab("leads")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 ${
                  crmTab === "leads"
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Leads ({activeLeadsCount})</span>
              </button>

              <button
                onClick={() => setCrmTab("customers")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 ${
                  crmTab === "customers"
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Customers ({activeCustomersCount})</span>
              </button>

              <button
                onClick={() => setCrmTab("tasks")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 ${
                  crmTab === "tasks"
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>Tasks Manager ({pendingTasks.length})</span>
              </button>

              <button
                onClick={() => setCrmTab("notifications")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 relative ${
                  crmTab === "notifications"
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Alerts</span>
                {alertCount > 0 && (
                  <span className={`absolute right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    crmTab === "notifications" ? "bg-black text-white" : "bg-red-500 text-white"
                  }`}>
                    {alertCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Logout info */}
          <div className="hidden lg:block space-y-4 pt-6 border-t border-white/5">
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Representative</p>
              <p className="text-xs text-gray-300 font-mono font-bold truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* Header */}
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

            {/* ──────────────────────────────────────────────────────── */}
            {/* 1. TAB: OVERVIEW */}
            {/* ──────────────────────────────────────────────────────── */}
            {crmTab === "overview" && (
              <div className="space-y-8">
                {/* Intro */}
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">CRM Dashboard</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Global view of active conversion pipelines, clients value, and follow-ups.
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Leads</span>
                      <div className="p-2 rounded-lg bg-white/5">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-extrabold text-white">{activeLeadsCount}</h3>
                      <p className="text-xs text-gray-500 mt-1">Raw pipeline inquiries</p>
                    </div>
                  </div>

                  <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
                      <div className="p-2 rounded-lg bg-white/5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-extrabold text-emerald-400">{activeCustomersCount}</h3>
                      <p className="text-xs text-gray-500 mt-1">Converted accounts</p>
                    </div>
                  </div>

                  <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Monthly Value</span>
                      <div className="p-2 rounded-lg bg-white/5">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-extrabold text-yellow-400">₹{totalContractVal.toLocaleString("en-IN")}</h3>
                      <p className="text-xs text-gray-500 mt-1">Contract value generated</p>
                    </div>
                  </div>

                  <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Pending Todos</span>
                      <div className="p-2 rounded-lg bg-white/5">
                        <CheckSquare className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-extrabold text-purple-400">{pendingTasks.length}</h3>
                      {overdueTasks.length > 0 ? (
                        <p className="text-xs text-rose-400 font-bold mt-1">{overdueTasks.length} Overdue tasks!</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">All follow-ups scheduled</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Split grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Recent Activities Log */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6">
                      <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                        Recent Global Activities
                      </h3>
                      {activities.length === 0 ? (
                        <p className="text-xs text-gray-600 italic py-6 text-center">No system events logged yet.</p>
                      ) : (
                        <div className="relative pl-6 border-l border-white/5 space-y-6 ml-2">
                          {activities.slice(0, 8).map(act => {
                            const badge =
                              act.activity_type === "converted"
                                ? "bg-emerald-500 text-black shadow"
                                : act.activity_type === "task_completed"
                                ? "bg-blue-500 text-black shadow"
                                : "bg-white/5 text-[#FF6A00]";

                            return (
                              <div key={act.id} className="relative">
                                <div className={`absolute -left-[35px] top-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold ${badge}`}>
                                  <Activity className="w-2.5 h-2.5" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-300 font-semibold">{act.description}</p>
                                  <p className="text-[10px] text-gray-500 font-mono">
                                    {new Date(act.created_at).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Services popularity and warnings */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Warnings Card */}
                    {overdueTasks.length > 0 && (
                      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200 backdrop-blur-sm space-y-3 shadow-lg">
                        <div className="flex gap-2.5 items-center">
                          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          <h4 className="text-sm font-bold text-white uppercase">Critical Attention</h4>
                        </div>
                        <p className="text-xs text-rose-300/80 leading-relaxed">
                          You have {overdueTasks.length} scheduled task(s) that are past their follow-up due dates. 
                          Check them in the Alerts menu immediately to maintain digital conversions.
                        </p>
                        <button
                          onClick={() => setCrmTab("notifications")}
                          className="text-xs font-bold text-rose-400 hover:text-white flex items-center gap-1 hover:underline"
                        >
                          <span>Review alerts</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Services distribution graph */}
                    <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                        Service Demand Distribution
                      </h4>
                      <div className="space-y-3.5">
                        {servicesList.slice(0, 5).map(service => {
                          const count = serviceCounts[service] || 0;
                          const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                          return (
                            <div key={service} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-400 truncate max-w-[200px]">{service}</span>
                                <span className="text-white font-mono">{count} ({pct.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-[#FF6A00] to-yellow-500 h-1.5 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────── */}
            {/* 2. TAB: LEADS */}
            {/* ──────────────────────────────────────────────────────── */}
            {crmTab === "leads" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Leads</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Manage raw web inquiries, schedule tasks, and convert prospects.
                  </p>
                </div>

                {/* Filter section */}
                <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search leads by name, business, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:outline-none focus:border-[#FF6A00]/50 text-sm text-white placeholder-gray-500"
                      />
                    </div>

                    {/* Status filter */}
                    <div className="relative w-full sm:w-48 shrink-0">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="all">All Inquiries</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                      <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Reset button */}
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Export */}
                    <button
                      onClick={() => exportCSV("leads")}
                      className="px-5 py-2.5 rounded-xl bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border border-[#FF6A00]/20 text-[#FF6A00] transition-all text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

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
                            const statusConfig = statusOptions.find(o => o.value === lead.status) || {
                              label: lead.status || "Unknown",
                              color: "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            };

                            return (
                              <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group">
                                <td className="py-5 px-6 font-mono text-xs text-gray-500">
                                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : ""}
                                </td>
                                <td
                                  className="py-5 px-6 cursor-pointer"
                                  onClick={() => setSelectedContact({ id: lead.id, type: "lead" })}
                                >
                                  <div className="font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                                    {lead.full_name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">{lead.business_name}</div>
                                </td>
                                <td className="py-5 px-6 text-xs text-gray-400 space-y-0.5">
                                  <div>{lead.phone}</div>
                                  {lead.email && <div className="text-[10px] text-gray-500 font-mono">{lead.email}</div>}
                                </td>
                                <td className="py-5 px-6">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
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

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs font-semibold text-gray-400">
                    <span className="text-xs text-gray-500">Showing {filteredLeads.length} total leads</span>
                    <div className="flex items-center gap-4">
                      <span>Page {currentPage} of {totalPages}</span>
                      <div className="flex gap-1.5">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────── */}
            {/* 3. TAB: CUSTOMERS */}
            {/* ──────────────────────────────────────────────────────── */}
            {crmTab === "customers" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Customers</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Monitor closed deals, monthly contracts, and project milestones.
                  </p>
                </div>

                {/* Filters */}
                <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:outline-none focus:border-[#FF6A00]/50 text-sm text-white placeholder-gray-500"
                      />
                    </div>

                    <div className="relative w-full sm:w-48 shrink-0">
                      <select
                        value={customerStatusFilter}
                        onChange={(e) => setCustomerStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="churned">Churned</option>
                      </select>
                      <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => exportCSV("customers")}
                      className="px-5 py-2.5 rounded-xl bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border border-[#FF6A00]/20 text-[#FF6A00] transition-all text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

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
                            const config = customerStatusOptions.find(o => o.value === cust.status) || {
                              label: cust.status,
                              color: "bg-gray-500/10 text-gray-400 border-gray-500/20"
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
                                <td className="py-5 px-6 text-xs text-gray-400">{cust.category || "General"}</td>
                                <td className="py-5 px-6 font-mono text-sm text-[#FF6A00] font-bold">
                                  ₹{(cust.contract_value || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="py-5 px-6">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
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

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs font-semibold text-gray-400">
                    <span className="text-xs text-gray-500">Showing {filteredCustomers.length} total customers</span>
                    <div className="flex items-center gap-4">
                      <span>Page {currentPage} of {totalPages}</span>
                      <div className="flex gap-1.5">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────── */}
            {/* 4. TAB: TASKS */}
            {/* ──────────────────────────────────────────────────────── */}
            {crmTab === "tasks" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">CRM Task Manager</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Track scheduled client calls, documentation delivery, and service setups.
                  </p>
                </div>

                {/* Filters */}
                <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:outline-none focus:border-[#FF6A00]/50 text-sm text-white placeholder-gray-500"
                      />
                    </div>

                    <div className="relative w-full sm:w-48 shrink-0">
                      <select
                        value={taskStatusFilter}
                        onChange={(e) => setTaskStatusFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="all">All States</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                      <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>

                    <div className="relative w-full sm:w-48 shrink-0">
                      <select
                        value={taskPriorityFilter}
                        onChange={(e) => setTaskPriorityFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-sm text-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Task Checklist cards layout */}
                <div className="space-y-4">
                  {fetching ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6A00] mx-auto"></div>
                    </div>
                  ) : paginatedTasks.length === 0 ? (
                    <p className="text-xs text-gray-600 text-center py-12 italic">No tasks match selected filter criteria.</p>
                  ) : (
                    paginatedTasks.map((task) => {
                      const isCompleted = task.status === "completed";
                      const priorityColor =
                        task.priority === "high"
                          ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                          : task.priority === "medium"
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-blue-400 bg-blue-500/10 border-blue-500/20";

                      return (
                        <div
                          key={task.id}
                          className={`p-5 rounded-2xl bg-white/[0.01] border glass-panel transition-all ${
                            isCompleted ? "border-white/5 opacity-55" : "border-white/5 hover:border-[#FF6A00]/20"
                          } flex items-start justify-between gap-4`}
                        >
                          <div className="flex gap-4 items-start flex-grow">
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
                              className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? "bg-[#FF6A00] border-[#FF6A00] text-black"
                                  : "border-gray-500 bg-transparent hover:border-[#FF6A00]"
                              }`}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <div className="space-y-1">
                              <p className={`text-base font-bold text-white ${isCompleted ? "line-through text-gray-500" : ""}`}>
                                {task.title}
                              </p>
                              <div className="text-xs text-gray-400 font-medium">
                                Associated with:{" "}
                                <span
                                  className="text-[#FF6A00] hover:underline cursor-pointer"
                                  onClick={() =>
                                    setSelectedContact({
                                      id: (task.lead_id || task.customer_id)!,
                                      type: task.lead_id ? "lead" : "customer"
                                    })
                                  }
                                >
                                  {getContactLabel(task.lead_id || task.customer_id, task.lead_id ? "lead" : "customer")}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2.5 items-center text-[10px] font-semibold pt-1">
                                <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${priorityColor}`}>
                                  {task.priority}
                                </span>
                                {task.due_date && (
                                  <span className="flex items-center gap-1 text-gray-500 font-mono">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      Due{" "}
                                      {new Date(task.due_date).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────── */}
            {/* 5. TAB: ALERTS / NOTIFICATIONS */}
            {/* ──────────────────────────────────────────────────────── */}
            {crmTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">Active CRM Alerts</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    System reminders for raw incoming prospects, overdue todos, or scheduled callbacks.
                  </p>
                </div>

                {alertCount === 0 ? (
                  <div className="glass-panel border border-white/5 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 shadow" />
                    <div>
                      <h3 className="text-lg font-bold text-white">All Clear!</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        No overdue follow-ups or pending raw leads require review.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 1. Overdue Alerts */}
                    {overdueTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-rose-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
                      >
                        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Overdue Action Alert</h4>
                          <p className="text-xs text-rose-200">
                            Task <strong className="text-white">"{task.title}"</strong> is overdue!
                          </p>
                          <p className="text-[10px] text-rose-400/80 font-semibold mt-1">
                            Client:{" "}
                            <span
                              className="underline cursor-pointer text-white"
                              onClick={() =>
                                setSelectedContact({
                                  id: (task.lead_id || task.customer_id)!,
                                  type: task.lead_id ? "lead" : "customer"
                                })
                              }
                            >
                              {getContactLabel(task.lead_id || task.customer_id, task.lead_id ? "lead" : "customer")}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 2. Today Due Alerts */}
                    {dueTodayTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
                      >
                        <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Follow-Up Due Today</h4>
                          <p className="text-xs text-amber-200">
                            Task <strong className="text-white">"{task.title}"</strong> needs completion today.
                          </p>
                          <p className="text-[10px] text-amber-400/80 font-semibold mt-1">
                            Client:{" "}
                            <span
                              className="underline cursor-pointer text-white"
                              onClick={() =>
                                setSelectedContact({
                                  id: (task.lead_id || task.customer_id)!,
                                  type: task.lead_id ? "lead" : "customer"
                                })
                              }
                            >
                              {getContactLabel(task.lead_id || task.customer_id, task.lead_id ? "lead" : "customer")}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 3. New Leads */}
                    {newLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-blue-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
                      >
                        <Users className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">New Web Prospect</h4>
                          <p className="text-xs text-blue-200">
                            <strong className="text-white">{lead.full_name}</strong> submitted an inquiry for{" "}
                            <strong className="text-white">{lead.business_name}</strong>.
                          </p>
                          <button
                            onClick={() => setSelectedContact({ id: lead.id, type: "lead" })}
                            className="text-[10px] font-bold text-blue-400 hover:text-white underline mt-1.5 block"
                          >
                            Open Lead Details sidebar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Slide-over CRM Contact details panel */}
      <AnimatePresence>
        {selectedContact && (
          <CrmDetailView
            isOpen={selectedContact !== null}
            entityId={selectedContact?.id || null}
            entityType={selectedContact?.type || "lead"}
            onClose={() => setSelectedContact(null)}
            onUpdate={fetchCrmData}
          />
        )}
      </AnimatePresence>

      {/* Convert Lead to Customer Modal */}
      <AnimatePresence>
        {convertingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConvertingLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel border border-white/5 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Convert to Customer Account</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Converting <strong className="text-white">{convertingLead.full_name}</strong> will create a client
                    account and mark their lead record as "converted".
                  </p>
                </div>
              </div>

              <form onSubmit={handleConvertLead} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Assigned Contract Value (INR)</label>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setConvertingLead(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg"
                  >
                    Confirm Conversion
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="text-lg font-bold text-white">Edit Lead details</h3>
                <button
                  onClick={() => setEditingLead(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveLeadEdits} className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Representative Name</label>
                      <input
                        type="text"
                        value={editForm.full_name || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Business Name</label>
                      <input
                        type="text"
                        value={editForm.business_name || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, business_name: e.target.value }))}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editForm.whatsapp || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Business Category</label>
                      <input
                        type="text"
                        value={editForm.category || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Pipeline Status</label>
                      <select
                        value={editForm.status || "new"}
                        onChange={(e) =>
                          setEditForm(prev => ({ ...prev, status: e.target.value as LeadDbRow["status"] }))
                        }
                        className={inputClasses}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Interested Services</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {servicesList.map(s => {
                        const isChecked = (editForm.services_interested || []).includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleEditCheckboxToggle(s)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                              isChecked
                                ? "bg-[#FF6A00]/10 border-[#FF6A00] text-white"
                                : "bg-white/[0.01] border-white/5 text-gray-400"
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[8px] font-bold ${
                              isChecked ? "bg-[#FF6A00] border-[#FF6A00] text-black" : "border-gray-600 bg-transparent"
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <span>{s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 -mx-6 -mb-6 p-5 bg-white/[0.01]">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 rounded-lg border border-white/5 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#FF6A00] text-black font-bold"
                  >
                    Save Edits
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCustomer(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="text-lg font-bold text-white">Edit Customer Account</h3>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveCustomerEdits} className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Representative Name</label>
                    <input
                      type="text"
                      value={editCustomerForm.full_name || ""}
                      onChange={(e) => setEditCustomerForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Business Name</label>
                    <input
                      type="text"
                      value={editCustomerForm.business_name || ""}
                      onChange={(e) => setEditCustomerForm(prev => ({ ...prev, business_name: e.target.value }))}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                      <input
                        type="text"
                        value={editCustomerForm.phone || ""}
                        onChange={(e) => setEditCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp</label>
                      <input
                        type="text"
                        value={editCustomerForm.whatsapp || ""}
                        onChange={(e) => setEditCustomerForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Contract Value (INR)</label>
                      <input
                        type="number"
                        value={editCustomerForm.contract_value || 0}
                        onChange={(e) => setEditCustomerForm(prev => ({ ...prev, contract_value: parseFloat(e.target.value) }))}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                      <select
                        value={editCustomerForm.status || "active"}
                        onChange={(e) =>
                          setEditCustomerForm(prev => ({
                            ...prev,
                            status: e.target.value as CustomerDbRow["status"]
                          }))
                        }
                        className={inputClasses}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="churned">Churned</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 -mx-6 -mb-6 p-5 bg-white/[0.01]">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-4 py-2 rounded-lg border border-white/5 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#FF6A00] text-black font-bold"
                  >
                    Save Edits
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Lead Dialog */}
      <AnimatePresence>
        {deletingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel border border-white/5 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="flex gap-3">
                <Trash2 className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Delete Lead Prospect?</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Remove lead representative "{deletingLead.full_name}" permanently.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingLead(null)}
                  className="px-4 py-2 rounded-xl border border-white/5 text-xs text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLead}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Customer Dialog */}
      <AnimatePresence>
        {deletingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCustomer(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel border border-white/5 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="flex gap-3">
                <Trash2 className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Delete Customer Account?</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Delete customer record "{deletingCustomer.full_name}" permanently.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingCustomer(null)}
                  className="px-4 py-2 rounded-xl border border-white/5 text-xs text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCustomer}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
