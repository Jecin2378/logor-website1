"use client";

import React from "react";
import { Check, Clock } from "lucide-react";
import type { CrmTask, LeadDbRow, CustomerDbRow } from "@/types/lead";
import { getContactLabel } from "@/utils/crm";
import AdminFilters from "./AdminFilters";

interface AdminTasksTabProps {
  tasks: CrmTask[];
  filteredTasks: CrmTask[];
  paginatedTasks: CrmTask[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  taskStatusFilter: string;
  setTaskStatusFilter: (val: string) => void;
  taskPriorityFilter: string;
  setTaskPriorityFilter: (val: string) => void;
  fetching: boolean;
  resetFilters: () => void;
  handleToggleTaskStatus: (task: CrmTask) => void;
  setSelectedContact: (contact: { id: string; type: "lead" | "customer" } | null) => void;
  leads: LeadDbRow[];
  customers: CustomerDbRow[];
}

export default function AdminTasksTab({
  tasks: _tasks,
  filteredTasks: _filteredTasks,
  paginatedTasks,
  searchTerm,
  setSearchTerm,
  taskStatusFilter,
  setTaskStatusFilter,
  taskPriorityFilter,
  setTaskPriorityFilter,
  fetching,
  resetFilters,
  handleToggleTaskStatus,
  setSelectedContact,
  leads,
  customers,
}: AdminTasksTabProps) {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">CRM Task Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track scheduled client calls, documentation delivery, and service setups.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search tasks..."
        filters={[
          {
            value: taskStatusFilter,
            onChange: setTaskStatusFilter,
            options: [
              { value: "all", label: "All States" },
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
            ],
          },
          {
            value: taskPriorityFilter,
            onChange: setTaskPriorityFilter,
            options: [
              { value: "all", label: "All Priorities" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ],
          },
        ]}
        onReset={resetFilters}
        showExport={false}
      />

      {/* Task Checklist cards layout */}
      <div className="space-y-4">
        {fetching ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6A00] mx-auto"></div>
          </div>
        ) : paginatedTasks.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-12 italic">
            No tasks match selected filter criteria.
          </p>
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
                  isCompleted
                    ? "border-white/5 opacity-55"
                    : "border-white/5 hover:border-[#FF6A00]/20"
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
                    <p
                      className={`text-base font-bold text-white ${isCompleted ? "line-through text-gray-500" : ""}`}
                    >
                      {task.title}
                    </p>
                    <div className="text-xs text-gray-400 font-medium">
                      Associated with:{" "}
                      <span
                        className="text-[#FF6A00] hover:underline cursor-pointer"
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
                    </div>
                    <div className="flex flex-wrap gap-2.5 items-center text-[10px] font-semibold pt-1">
                      <span
                        className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${priorityColor}`}
                      >
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
                              minute: "2-digit",
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
  );
}
