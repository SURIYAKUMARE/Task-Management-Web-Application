import React from "react";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 rounded-2xl bg-card border border-border/60 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-muted rounded-md" />
            <div className="h-8 w-8 bg-muted rounded-xl" />
          </div>
          <div className="h-7 w-16 bg-muted rounded-md" />
          <div className="h-3 w-32 bg-muted/60 rounded-md" />
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
          className="h-20 rounded-2xl bg-card border border-border/60 p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded-md bg-muted" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted/60 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-8 w-8 bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-72 rounded-2xl bg-card border border-border/60 p-6 animate-pulse flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-5 w-48 bg-muted rounded" />
        <div className="h-3 w-32 bg-muted/60 rounded" />
      </div>
      <div className="h-44 w-full bg-muted/40 rounded-xl" />
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-6 animate-pulse space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted rounded-lg" />
          <div className="h-8 w-16 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-xl p-2 space-y-2">
            <div className="h-3 w-6 bg-muted rounded" />
            {i % 3 === 0 && <div className="h-4 w-full bg-muted/60 rounded-md" />}
          </div>
        ))}
      </div>
    </div>
  );
}
