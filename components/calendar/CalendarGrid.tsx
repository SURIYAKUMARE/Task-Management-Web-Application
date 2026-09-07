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

  // Next month filler days to complete 35 or 42 grid cells
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
    <div className="rounded-3xl bg-card border border-border/80 shadow-xs overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border/70 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-muted-foreground">
              {tasks.filter((t) => t.due_date?.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length} tasks due this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-xs">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30 text-center py-2.5">
        {weekDayLabels.map((day) => (
          <span key={day} className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
        {calendarCells.map((cell, idx) => {
          const cellTasks = tasksByDate[cell.dateStr] || [];
          const isCurrent = cell.monthType === "current";

          return (
            <div
              key={idx}
              onClick={() => onCreateTaskOnDate(cell.dateStr)}
              className={cn(
                "group relative min-h-[96px] sm:min-h-[115px] p-2 transition-colors cursor-pointer hover:bg-muted/40",
                !isCurrent ? "bg-muted/15 opacity-50" : "bg-card",
                cell.isToday && "bg-primary/[0.03]"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "inline-flex items-center justify-center text-xs font-semibold rounded-full w-6 h-6",
                    cell.isToday
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
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
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-opacity"
                  title="Add task on this date"
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
                      "px-2 py-0.5 rounded-md text-[11px] font-medium truncate border shadow-2xs hover:opacity-90 transition-all",
                      task.status === "completed"
                        ? "line-through bg-muted/60 text-muted-foreground border-border/50"
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
                  <div className="text-[10px] text-muted-foreground font-semibold px-1">
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
