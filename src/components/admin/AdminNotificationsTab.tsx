"use client";

import React from "react";
import { AlertCircle, Clock, Users, CheckCircle2 } from "lucide-react";
import { getContactLabel } from "@/utils/crm";
import type { CrmTask, LeadDbRow, CustomerDbRow } from "@/types/lead";

interface AdminNotificationsTabProps {
  overdueTasks: CrmTask[];
  dueTodayTasks: CrmTask[];
  newLeads: LeadDbRow[];
  alertCount: number;
  leads: LeadDbRow[];
  customers: CustomerDbRow[];
  setSelectedContact: (contact: { id: string; type: "lead" | "customer" } | null) => void;
}

export default function AdminNotificationsTab({
  overdueTasks,
  dueTodayTasks,
  newLeads,
  alertCount,
  leads,
  customers,
  setSelectedContact,
}: AdminNotificationsTabProps) {

  if (alertCount === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Active CRM Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">
            System reminders for raw incoming prospects, overdue todos, or scheduled callbacks.
          </p>
        </div>
        <div className="glass-panel border border-white/5 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 shadow" />
          <div>
            <h3 className="text-lg font-bold text-white">All Clear!</h3>
            <p className="text-xs text-gray-400 mt-1">
              No overdue follow-ups or pending raw leads require review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Active CRM Alerts</h1>
        <p className="text-gray-400 text-sm mt-1">
          System reminders for raw incoming prospects, overdue todos, or scheduled callbacks.
        </p>
      </div>

      <div className="space-y-4">
        {/* Alert Summary */}
        <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-rose-400">{overdueTasks.length}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Overdue Tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-400">{dueTodayTasks.length}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Due Today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-blue-400">{newLeads.length}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">New Leads</p>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        {overdueTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-rose-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
          >
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Overdue Action Alert
              </h4>
              <p className="text-xs text-rose-200">
                Task <strong className="text-white">&ldquo;{task.title}&rdquo;</strong> is overdue!
              </p>
              <p className="text-[10px] text-rose-400/80 font-semibold mt-1">
                Client:{" "}
                <span
                  className="underline cursor-pointer text-white"
                  onClick={() =>
                    setSelectedContact({
                      id: (task.lead_id || task.customer_id)!,
                      type: task.lead_id ? "lead" : "customer",
                    })
                  }
                >
                  {getContactLabel(
                    task.lead_id || task.customer_id,
                    task.lead_id ? "lead" : "customer",
                    leads,
                    customers
                  )}
                </span>
              </p>
            </div>
          </div>
        ))}

        {/* Today Due Tasks */}
        {dueTodayTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
          >
            <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Follow-Up Due Today
              </h4>
              <p className="text-xs text-amber-200">
                Task <strong className="text-white">&ldquo;{task.title}&rdquo;</strong> is due today.
              </p>
              <p className="text-[10px] text-amber-400/80 font-semibold mt-1">
                Client:{" "}
                <span
                  className="underline cursor-pointer text-white"
                  onClick={() =>
                    setSelectedContact({
                      id: (task.lead_id || task.customer_id)!,
                      type: task.lead_id ? "lead" : "customer",
                    })
                  }
                >
                  {getContactLabel(
                    task.lead_id || task.customer_id,
                    task.lead_id ? "lead" : "customer",
                    leads,
                    customers
                  )}
                </span>
              </p>
            </div>
          </div>
        ))}

        {/* New Leads */}
        {newLeads.map((lead) => (
          <div
            key={lead.id}
            className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-blue-300 backdrop-blur-sm flex items-start gap-4 shadow-md"
          >
            <Users className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                New Lead Received
              </h4>
              <p className="text-xs text-blue-200">
                <strong className="text-white">{lead.full_name}</strong> from{" "}
                <strong className="text-white">{lead.business_name}</strong> has submitted a
                consultation request.
              </p>
              <p className="text-[10px] text-blue-400/80 font-semibold mt-1">
                <span
                  className="underline cursor-pointer text-white"
                  onClick={() => setSelectedContact({ id: lead.id, type: "lead" })}
                >
                  View Lead Details
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
