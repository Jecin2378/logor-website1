"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  CheckSquare,
  Bell,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  crmTab: "overview" | "leads" | "customers" | "tasks" | "notifications";
  setCrmTab: (tab: "overview" | "leads" | "customers" | "tasks" | "notifications") => void;
  activeLeadsCount: number;
  activeCustomersCount: number;
  pendingTasksCount: number;
  alertCount: number;
  userEmail: string;
  handleLogout: () => void;
}

export default function AdminSidebar({
  crmTab,
  setCrmTab,
  activeLeadsCount,
  activeCustomersCount,
  pendingTasksCount,
  alertCount,
  userEmail,
  handleLogout,
}: AdminSidebarProps) {
  const navItems = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp, badge: null },
    { id: "leads" as const, label: `Leads (${activeLeadsCount})`, icon: Users, badge: null },
    { id: "customers" as const, label: `Customers (${activeCustomersCount})`, icon: CheckCircle2, badge: null },
    { id: "tasks" as const, label: `Tasks Manager (${pendingTasksCount})`, icon: CheckSquare, badge: null },
    { id: "notifications" as const, label: "Alerts", icon: Bell, badge: alertCount },
  ];

  return (
    <aside className="w-full lg:w-64 bg-charcoal-deep border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logor-logo.png"
              alt="Logor"
              width={90}
              height={30}
              className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 select-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = crmTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCrmTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full shrink-0 ${
                  isActive
                    ? "bg-[#FF6A00] text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isActive ? "bg-black text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
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
  );
}
