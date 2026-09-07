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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, description, or category..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Sort & View Mode Switcher */}
      <div className="flex items-center justify-between md:justify-end gap-2.5">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-2.5 py-1.5 shadow-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-card">Newest First</option>
            <option value="oldest" className="bg-card">Oldest First</option>
            <option value="due_date" className="bg-card">Due Date</option>
            <option value="priority" className="bg-card">Priority</option>
            <option value="recently_updated" className="bg-card">Recently Updated</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/80">
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="List View"
            aria-label="List View"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-card text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewModeChange("kanban")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "kanban"
                ? "bg-card text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Kanban Board"
            aria-label="Kanban Board"
          >
            <Kanban className="w-4 h-4" />
          </button>
        </div>

        {/* Task Counter */}
        <div className="hidden lg:inline-flex text-[11px] text-muted-foreground font-medium pl-2">
          {filteredTasksCount} of {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
        </div>
      </div>
    </div>
  );
}
