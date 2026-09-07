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
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      badge: "All time",
    },
    {
      title: "Completed",
      value: stats.completed,
      subtitle: `${stats.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      badge: `${stats.completedThisWeek} this week`,
      badgeIcon: TrendingUp,
    },
    {
      title: "Pending",
      value: stats.pending,
      subtitle: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% of active workload`,
      icon: Clock,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      badge: "In pipeline",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      subtitle: stats.overdue > 0 ? "Requires urgent attention" : "All deadlines on track!",
      icon: AlertTriangle,
      color: stats.overdue > 0
        ? "from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/30"
        : "from-slate-500/10 to-gray-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      iconBg: stats.overdue > 0 ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground",
      badge: stats.overdue > 0 ? "Action needed" : "Healthy",
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
            className={`relative overflow-hidden rounded-2xl bg-card border ${card.color} p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {card.value}
              </span>
              {card.badge && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  card.isUrgent
                    ? "bg-red-500/15 text-red-600 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {BadgeIcon && <BadgeIcon className="w-3 h-3 text-emerald-500" />}
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              {card.subtitle}
            </p>

            {/* Subtle progress indicator */}
            {card.title === "Completed" && stats.total > 0 && (
              <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
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
