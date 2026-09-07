"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Task } from "@/types";
import { PieChart as PieIcon } from "lucide-react";

interface CategoryDonutProps {
  tasks: Task[];
}

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];

export function CategoryDonut({ tasks }: CategoryDonutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group by category
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    const cat = task.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const data = Object.keys(categoryCounts).map((category) => ({
    name: category,
    value: categoryCounts[category],
  }));

  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs flex flex-col items-center justify-center h-full min-h-[260px]">
        <p className="text-xs text-muted-foreground">No category data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <span>Category Distribution</span>
          <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-500">
            <PieIcon className="w-3.5 h-3.5" />
          </span>
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Workload breakdown across focus areas
        </p>
      </div>

      <div className="h-44 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              formatter={(value: number) => [`${value} tasks`, "Count"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
        {data.slice(0, 4).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-muted-foreground truncate">{item.name}</span>
            <span className="font-semibold text-foreground ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
