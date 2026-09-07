"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Task } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Delete Task
            </h3>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
          <p className="text-xs font-semibold text-foreground truncate">
            &quot;{task.title}&quot;
          </p>
          {task.description && (
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {task.description}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete this task? All tracking history and due date reminders for this task will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
