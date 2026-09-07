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
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-card/60 border border-dashed border-border/80 my-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No tasks match your filters</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
          Try adjusting your search keywords, priority level, category, or date range.
        </p>
        <div className="flex items-center gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
          {onAction && (
            <button
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-card/60 border border-dashed border-border/80 my-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h3 className="text-xl font-bold text-foreground">You&apos;re all caught up! 🎉</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1.5 mb-6">
        Create your first task to get started organizing your work, projects, and goals.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          + Create Task
        </button>
      )}
    </div>
  );
}
