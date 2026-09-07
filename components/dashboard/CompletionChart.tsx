"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DayCompletionData } from "@/types";
import { TrendingUp, Award } from "lucide-react";

interface CompletionChartProps {
  data: DayCompletionData[];
  completionRate: number;
}

export function CompletionChart({ data, completionRate }: CompletionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 rounded-2xl bg-card border border-border/80 p-6 flex items-center justify-center">
        <span className="text-xs text-muted-foreground animate-pulse">Loading analytics...</span>
      </div>
    );
  }

  const totalCompletedInWeek = data.reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <span>Productivity Velocity</span>
            <span className="p-1 rounded-md bg-primary/10 text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tasks completed per day over the past 7 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>{totalCompletedInWeek} Done This Week</span>
          </div>
          <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-xl font-medium">
            {completionRate}% Overall Rate
          </div>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} tasks`, "Completed"]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#completedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
