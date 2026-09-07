"use client";

import React from "react";
import { Task } from "@/types";
import {
  formatDate,
  formatTime,
  getPriorityBadgeColor,
  getStatusBadgeColor,
  getCategoryBadgeColor,
  isTaskOverdue,
  cn,
} from "@/lib/utils";
import {
  X,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Flag,
  RotateCcw,
} from "lucide-react";

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === "completed";
  const overdue = isTaskOverdue(task);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider",
                getPriorityBadgeColor(task.priority)
              )}
            >
              {task.priority}
            </span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                getStatusBadgeColor(task.status)
              )}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h3 className={cn(
              "text-xl font-bold tracking-tight text-foreground leading-snug",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {overdue && !isCompleted && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                This task is overdue
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </span>
            <p className="mt-1.5 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-muted/30 p-3.5 rounded-2xl border border-border/50">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3 text-primary" /> Category
              </span>
              <span className={cn(
                "mt-1 inline-block px-2 py-0.5 rounded-md font-medium text-xs border",
                getCategoryBadgeColor(task.category)
              )}>
                {task.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" /> Due Date
              </span>
              <span className="mt-1 inline-block font-semibold text-foreground">
                {task.due_date ? formatDate(task.due_date) : "Not set"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" /> Due Time
              </span>
              <span className="mt-1 inline-block font-semibold text-foreground">
                {task.due_time ? formatTime(task.due_time) : "Not set"}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-muted-foreground gap-1">
            <span>Created: {new Date(task.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
            <span>Last Updated: {new Date(task.updated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border/70 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Task</span>
            </button>

            <button
              onClick={() => {
                onToggleComplete(task);
                onClose();
              }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs",
                isCompleted
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
              )}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen Task</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
