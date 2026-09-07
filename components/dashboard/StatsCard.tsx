import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from "lucide-react";
import { TaskStats } from "@/types";

interface StatsCardsProps {
  stats: TaskStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      subtitle: `${stats.createdThisWeek} created this week`,
      icon: Layers,
      color: "border-blue-200 dark:border-blue-900/40",
      iconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
      badge: "All time",
      badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
    },
    {
      title: "Completed",
      value: stats.completed,
      subtitle: `${stats.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "border-emerald-200 dark:border-emerald-900/40",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50",
      badge: `${stats.completedThisWeek} this week`,
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
      badgeIcon: TrendingUp,
    },
    {
      title: "Pending",
      value: stats.pending,
      subtitle: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% of active workload`,
      icon: Clock,
      color: "border-amber-200 dark:border-amber-900/40",
      iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
      badge: "In pipeline",
      badgeColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      subtitle: stats.overdue > 0 ? "Requires urgent attention" : "All deadlines on track!",
      icon: AlertTriangle,
      color: stats.overdue > 0
        ? "border-red-300 dark:border-red-900/60 ring-1 ring-red-500/20"
        : "border-slate-200 dark:border-slate-800",
      iconBg: stats.overdue > 0
        ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50"
        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
      badge: stats.overdue > 0 ? "Action needed" : "Healthy",
      badgeColor: stats.overdue > 0
        ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 font-bold"
        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      isUrgent: stats.overdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border ${card.color} p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </span>
              {card.badge && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                  {BadgeIcon && <BadgeIcon className="w-3 h-3 text-emerald-500" />}
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              {card.subtitle}
            </p>

            {/* Subtle progress indicator */}
            {card.title === "Completed" && stats.total > 0 && (
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
