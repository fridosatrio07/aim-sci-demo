"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminActivity } from "@/lib/admin-data";
import { ADMIN_MODULE_FILTERS } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

interface AdminActivityTableProps {
  activities: AdminActivity[];
}

const emailPattern = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i;

function ActivityText({ activity }: { activity: string }) {
  const match = activity.match(emailPattern);

  if (!match) {
    return <span>{activity}</span>;
  }

  const [email] = match;
  const [prefix, suffix] = activity.split(email);

  return (
    <span>
      {prefix}
      <a className="font-semibold text-blue-700 hover:underline" href={`mailto:${email}`}>
        {email}
      </a>
      {suffix}
    </span>
  );
}

export function AdminActivityTable({ activities }: AdminActivityTableProps) {
  const [selectedModule, setSelectedModule] = useState("All Modules");

  const visibleActivities = useMemo(() => {
    if (selectedModule === "All Modules") return activities;
    return activities.filter((activity) => activity.module === selectedModule);
  }, [activities, selectedModule]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-bold text-slate-950">Recent Admin Activity</h2>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="sr-only" htmlFor="admin-module-filter">
            Module
          </label>
          <select
            id="admin-module-filter"
            className="h-10 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
            value={selectedModule}
            onChange={(event) => setSelectedModule(event.target.value)}
          >
            {ADMIN_MODULE_FILTERS.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="flex h-10 min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm sm:w-56"
          >
            <span className="truncate">01/05/2025 - 10/05/2025</span>
            <CalendarDays className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
          </button>

          <Button type="button" variant="outline" className="h-10 gap-2 text-blue-700">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-600">
            <tr>
              {["Date & Time", "User", "Activity", "Module", "Status", "IP Address"].map((column) => (
                <th key={column} className="border-b border-slate-200 px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleActivities.map((activity) => (
              <tr key={`${activity.dateTime}-${activity.activity}`} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{activity.dateTime}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        activity.user === "System" ? "bg-slate-100 text-slate-700" : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {activity.userInitials}
                    </span>
                    <span className="font-semibold text-slate-800">{activity.user}</span>
                  </div>
                </td>
                <td className="max-w-[360px] px-4 py-3 text-slate-700">
                  <ActivityText activity={activity.activity} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{activity.module}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge variant={activity.status === "Success" ? "green" : "red"}>{activity.status}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{activity.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
        <span>Showing 1 to {visibleActivities.length} of 58 activities</span>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="h-9 px-2">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-bold",
                page === 1 ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {page}
            </button>
          ))}
          <span className="px-1 font-bold text-slate-500">...</span>
          <button type="button" className="flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            6
          </button>
          <Button type="button" variant="outline" size="sm" className="h-9 px-2">
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <select
            aria-label="Page size"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
            defaultValue="10"
          >
            <option value="10">10 / page</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
