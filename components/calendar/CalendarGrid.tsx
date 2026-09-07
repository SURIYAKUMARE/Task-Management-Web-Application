"use client";

import React, { useState } from "react";
import { Task } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { getPriorityBadgeColor, cn } from "@/lib/utils";

interface CalendarGridProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onCreateTaskOnDate: (dateStr: string) => void;
}

export function CalendarGrid({
  tasks,
  onSelectTask,
  onCreateTaskOnDate,
}: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build grid calendar cells
  const calendarCells: {
    day: number;
    monthType: "prev" | "current" | "next";
    dateStr: string;
    isToday: boolean;
  }[] = [];

  // Prev month filler days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({
      day,
      monthType: "prev",
      dateStr,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isToday = isCurrentMonth && today.getDate() === d;
    calendarCells.push({
      day: d,
      monthType: "current",
      dateStr,
      isToday,
    });
  }

  // Next month filler days to complete 42 grid cells
  const remaining = 42 - calendarCells.length;
  for (let n = 1; n <= remaining; n++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    calendarCells.push({
      day: n,
      monthType: "next",
      dateStr,
      isToday: false,
    });
  }

  // Map tasks by date string
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    if (task.due_date) {
      if (!tasksByDate[task.due_date]) {
        tasksByDate[task.due_date] = [];
      }
      tasksByDate[task.due_date].push(task);
    }
  });

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 gap-4 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {tasks.filter((t) => t.due_date?.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length} tasks scheduled for this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-xs">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center py-3">
        {weekDayLabels.map((day) => (
          <span key={day} className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
        {calendarCells.map((cell, idx) => {
          const cellTasks = tasksByDate[cell.dateStr] || [];
          const isCurrent = cell.monthType === "current";

          return (
            <div
              key={idx}
              onClick={() => onCreateTaskOnDate(cell.dateStr)}
              className={cn(
                "group relative min-h-[100px] sm:min-h-[120px] p-2.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40",
                !isCurrent ? "bg-slate-50/40 dark:bg-slate-900/30 opacity-40" : "bg-white dark:bg-slate-900",
                cell.isToday && "bg-indigo-50/30 dark:bg-indigo-950/20"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "inline-flex items-center justify-center text-xs font-bold rounded-full w-6 h-6",
                    cell.isToday
                      ? "bg-indigo-600 text-white shadow-xs"
                      : isCurrent
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-400"
                  )}
                >
                  {cell.day}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateTaskOnDate(cell.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-opacity"
                  title="Schedule task on this date"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Chips */}
              <div className="space-y-1">
                {cellTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(task);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[11px] font-bold truncate border shadow-2xs hover:opacity-90 transition-all",
                      task.status === "completed"
                        ? "line-through bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                        : getPriorityBadgeColor(task.priority)
                    )}
                    title={`${task.title} (${task.priority})`}
                  >
                    {task.due_time && (
                      <span className="font-bold mr-1 opacity-75 text-[10px]">
                        {task.due_time}
                      </span>
                    )}
                    {task.title}
                  </div>
                ))}

                {cellTasks.length > 3 && (
                  <div className="text-[10px] text-slate-400 font-bold px-1">
                    +{cellTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
