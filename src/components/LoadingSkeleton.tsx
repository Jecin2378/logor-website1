"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

function Pulse({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/[0.03] rounded-xl animate-pulse ${className}`}
      style={{ animationDuration: "1.5s" }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Pulse className="h-8 w-24" />
        <Pulse className="h-3 w-32" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-5 px-6">
          <Pulse className={`h-4 ${i === 1 ? "w-32" : i === 2 ? "w-28" : "w-16"}`} />
        </td>
      ))}
    </tr>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-6 pl-6 border-l border-white/5 ml-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="relative space-y-2">
          <div className="absolute -left-[35px] top-0.5 w-[18px] h-[18px] rounded-full bg-white/5" />
          <Pulse className="h-3 w-48" />
          <Pulse className="h-2 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-start gap-4">
      <Pulse className="w-4.5 h-4.5 rounded border mt-0.5 shrink-0" />
      <div className="flex-grow space-y-2">
        <Pulse className="h-4 w-56" />
        <div className="flex gap-2">
          <Pulse className="h-3 w-12 rounded-full" />
          <Pulse className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Pulse className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2">
          <Pulse className="h-4 w-36" />
          <Pulse className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-4 pt-5 border-t border-white/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Pulse className="w-4 h-4 rounded" />
            <Pulse className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="space-y-2">
        <Pulse className="h-8 w-56" />
        <Pulse className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-panel border border-white/5 rounded-3xl p-6">
            <Pulse className="h-4 w-40 mb-6" />
            <ActivityFeedSkeleton />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Pulse className="h-32 rounded-2xl" />
          <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
            <Pulse className="h-3 w-32" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Pulse className="h-3 w-20" />
                  <Pulse className="h-3 w-12" />
                </div>
                <Pulse className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortalDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
      {/* Milestones skeleton */}
      <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8">
        <Pulse className="h-5 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start md:flex-col md:items-center gap-4">
              <Pulse className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-1">
                <Pulse className="h-4 w-28" />
                <Pulse className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile + Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCardSkeleton />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Pulse className="h-5 w-40" />
              <Pulse className="h-5 w-24 rounded-full" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/5 mb-3">
                <div className="flex gap-3">
                  <Pulse className="w-4 h-4 rounded-full mt-0.5 shrink-0" />
                  <div className="space-y-1 flex-grow">
                    <Pulse className="h-4 w-48" />
                    <Pulse className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
