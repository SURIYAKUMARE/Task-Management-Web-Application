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
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center justify-center h-full min-h-[260px] text-slate-900 dark:text-slate-100">
        <PieIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-xs font-semibold text-slate-400">No category data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between text-slate-900 dark:text-slate-100">
      <div>
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span>Category Distribution</span>
          <span className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
            <PieIcon className="w-4 h-4" />
          </span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "14px",
                fontSize: "12px",
                color: "#ffffff",
              }}
              formatter={(value: number) => [`${value} tasks`, "Count"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {data.slice(0, 4).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-slate-500 dark:text-slate-400 truncate">{item.name}</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
