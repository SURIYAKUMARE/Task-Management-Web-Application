import React from "react";
import { CheckCircle2, Search, PlusCircle, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  isFiltered?: boolean;
  onAction?: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({ isFiltered, onAction, onClearFilters }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 my-4 animate-fade-in shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks match your filters</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
          Try adjusting your search keywords, priority level, category, or date range.
        </p>
        <div className="flex items-center gap-3">
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:opacity-90 transition-opacity shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Task
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 my-4 animate-fade-in shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800/40">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white">You&apos;re all caught up! 🎉</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 mb-6 leading-relaxed">
        Create your first task to get started organizing your work, projects, and goals.
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          + Create Task
        </button>
      )}
    </div>
  );
}
