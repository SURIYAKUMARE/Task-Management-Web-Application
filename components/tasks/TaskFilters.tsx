"use client";

import React from "react";
import { FilterOptions, TaskPriority, TaskStatus, DateFilter } from "@/types";
import { Filter, RotateCcw } from "lucide-react";

interface TaskFiltersProps {
  filters: FilterOptions;
  onFilterChange: (updates: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
}

const CATEGORIES = [
  "All",
  "College",
  "Personal",
  "Project",
  "Coding",
  "Assignment",
  "Other",
];

const STATUSES: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const PRIORITIES: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Any Date" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
];

export function TaskFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: TaskFiltersProps) {
  const isAnyFilterActive =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.dateFilter !== "all" ||
    filters.search !== "";

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
        <Filter className="w-3.5 h-3.5 text-indigo-500" />
        <span>Filters:</span>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value as TaskStatus | "all" })}
        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
      >
        {STATUSES.map((st) => (
          <option key={st.value} value={st.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {st.label}
          </option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value as TaskPriority | "all" })}
        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {p.label}
          </option>
        ))}
      </select>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat === "All" ? "all" : cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {cat === "All" ? "All Categories" : cat}
          </option>
        ))}
      </select>

      {/* Date Filter */}
      <select
        value={filters.dateFilter}
        onChange={(e) => onFilterChange({ dateFilter: e.target.value as DateFilter })}
        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
      >
        {DATE_FILTERS.map((d) => (
          <option key={d.value} value={d.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {d.label}
          </option>
        ))}
      </select>

      {/* Reset Button */}
      {isAnyFilterActive && (
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset all active filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
