"use client";

import React from "react";
import { TaskViewMode, SortOption } from "@/types";
import { Search, LayoutGrid, List, Kanban, ArrowUpDown, X } from "lucide-react";

interface TaskSearchSortProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  totalTasks: number;
  filteredTasksCount: number;
}

export function TaskSearchSort({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalTasks,
  filteredTasksCount,
}: TaskSearchSortProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, description, or category..."
          className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Sort & View Mode Switcher */}
      <div className="flex items-center justify-between md:justify-end gap-2.5">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 shadow-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-white dark:bg-slate-900">Newest First</option>
            <option value="oldest" className="bg-white dark:bg-slate-900">Oldest First</option>
            <option value="due_date" className="bg-white dark:bg-slate-900">Due Date</option>
            <option value="priority" className="bg-white dark:bg-slate-900">Priority</option>
            <option value="recently_updated" className="bg-white dark:bg-slate-900">Recently Updated</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="List View"
            aria-label="List View"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === "kanban"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Kanban Board"
            aria-label="Kanban Board"
          >
            <Kanban className="w-4 h-4" />
          </button>
        </div>

        {/* Task Counter */}
        <div className="hidden lg:inline-flex text-[11px] text-slate-500 dark:text-slate-400 font-semibold pl-2">
          {filteredTasksCount} of {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
        </div>
      </div>
    </div>
  );
}
