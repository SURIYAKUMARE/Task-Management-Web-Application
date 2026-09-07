import React from "react";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-850 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-72 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse flex flex-col justify-between shadow-xs">
      <div className="space-y-2">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-32 bg-slate-100 dark:bg-slate-850 rounded" />
      </div>
      <div className="h-44 w-full bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-6 shadow-xs">
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100/70 dark:bg-slate-800/30 rounded-2xl p-2 space-y-2">
            <div className="h-3 w-6 bg-slate-200 dark:bg-slate-800 rounded" />
            {i % 3 === 0 && <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />}
          </div>
        ))}
      </div>
    </div>
  );
}
