"use client";

import React from "react";
import {
  Users,
  CheckCircle2,
  DollarSign,
  CheckSquare,
  Activity,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { LeadDbRow, CustomerDbRow, CrmTask, CrmActivity } from "@/types/lead";

const servicesList = [
  "NFC Business Cards",
  "Digital Landing Pages",
  "Google Business Profile Setup",
  "QR Code Solutions",
  "Google Review Solutions",
  "WhatsApp Business Integration",
  "Online Reputation Management",
  "Search Engine Optimization",
];

interface AdminDashboardOverviewProps {
  leads: LeadDbRow[];
  customers: CustomerDbRow[];
  tasks: CrmTask[];
  activities: CrmActivity[];
  activeLeadsCount: number;
  activeCustomersCount: number;
  totalContractVal: number;
  pendingTasks: CrmTask[];
  overdueTasks: CrmTask[];
  dueTodayTasks: CrmTask[];
  newLeadsCount: number;
  setCrmTab: (tab: "overview" | "leads" | "customers" | "tasks" | "notifications") => void;
}

export default function AdminDashboardOverview({
  leads,
  customers: _customers,
  tasks: _tasks,
  activities,
  activeLeadsCount,
  activeCustomersCount,
  totalContractVal,
  pendingTasks,
  overdueTasks,
  dueTodayTasks,
  newLeadsCount,
  setCrmTab,
}: AdminDashboardOverviewProps) {
  // Services distribution
  const serviceCounts: Record<string, number> = {};
  leads.forEach((lead) => {
    if (lead.services_interested && Array.isArray(lead.services_interested)) {
      lead.services_interested.forEach((service) => {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });
    }
  });
  const totalLeads = leads.length;

  const _alertCount = overdueTasks.length + dueTodayTasks.length + newLeadsCount;

  return (
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
        <StatCard
          label="Active Leads"
          value={activeLeadsCount}
          subtext="Raw pipeline inquiries"
          icon={<Users className="w-5 h-5 text-blue-400" />}
          valueClass="text-white"
        />
        <StatCard
          label="Active Customers"
          value={activeCustomersCount}
          subtext="Converted accounts"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          valueClass="text-emerald-400"
        />
        <StatCard
          label="Monthly Value"
          value={`₹${totalContractVal.toLocaleString("en-IN")}`}
          subtext="Contract value generated"
          icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
          valueClass="text-yellow-400"
        />
        <StatCard
          label="Pending Todos"
          value={pendingTasks.length}
          subtext={
            overdueTasks.length > 0
              ? `${overdueTasks.length} Overdue tasks!`
              : "All follow-ups scheduled"
          }
          subtextClass={overdueTasks.length > 0 ? "text-rose-400 font-bold" : ""}
          icon={<CheckSquare className="w-5 h-5 text-purple-400" />}
          valueClass="text-purple-400"
        />
      </div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activities */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Recent Global Activities
            </h3>
            {activities.length === 0 ? (
              <p className="text-xs text-gray-600 italic py-6 text-center">
                No system events logged yet.
              </p>
            ) : (
              <div className="relative pl-6 border-l border-white/5 space-y-6 ml-2">
                {activities.slice(0, 8).map((act) => {
                  const badge =
                    act.activity_type === "converted"
                      ? "bg-emerald-500 text-black shadow"
                      : act.activity_type === "task_completed"
                      ? "bg-blue-500 text-black shadow"
                      : "bg-white/5 text-[#FF6A00]";

                  return (
                    <div key={act.id} className="relative">
                      <div
                        className={`absolute -left-[35px] top-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold ${badge}`}
                      >
                        <Activity className="w-2.5 h-2.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-300 font-semibold">
                          {act.description}
                        </p>
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

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Warnings Card */}
          {overdueTasks.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200 backdrop-blur-sm space-y-3 shadow-lg">
              <div className="flex gap-2.5 items-center">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <h4 className="text-sm font-bold text-white uppercase">
                  Critical Attention
                </h4>
              </div>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                You have {overdueTasks.length} scheduled task(s) that are past their
                follow-up due dates. Check them in the Alerts menu immediately to
                maintain digital conversions.
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

          {/* Services distribution */}
          <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
              Service Demand Distribution
            </h4>
            <div className="space-y-3.5">
              {servicesList.slice(0, 5).map((service) => {
                const count = serviceCounts[service] || 0;
                const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                return (
                  <div key={service} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-400 truncate max-w-[200px]">
                        {service}
                      </span>
                      <span className="text-white font-mono">
                        {count} ({pct.toFixed(0)}%)
                      </span>
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
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  valueClass = "text-white",
  subtextClass = "",
}: {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  valueClass?: string;
  subtextClass?: string;
}) {
  return (
    <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="flex justify-between items-start text-gray-400">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div className="mt-4">
        <h3 className={`text-3xl font-extrabold ${valueClass}`}>{value}</h3>
        <p className={`text-xs text-gray-500 mt-1 ${subtextClass}`}>{subtext}</p>
      </div>
    </div>
  );
}
