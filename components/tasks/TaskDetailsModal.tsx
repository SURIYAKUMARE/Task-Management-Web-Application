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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider",
                getPriorityBadgeColor(task.priority)
              )}
            >
              {task.priority}
            </span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize",
                getStatusBadgeColor(task.status)
              )}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h3
              className={cn(
                "text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug",
                isCompleted && "line-through text-slate-400 dark:text-slate-500"
              )}
            >
              {task.title}
            </h3>
            {overdue && !isCompleted && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                This task is overdue
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Description
            </span>
            <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-500" /> Category
              </span>
              <span
                className={cn(
                  "mt-1.5 inline-block px-2 py-0.5 rounded-md font-semibold text-xs border",
                  getCategoryBadgeColor(task.category)
                )}
              >
                {task.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-500" /> Due Date
              </span>
              <span className="mt-1.5 inline-block font-bold text-slate-900 dark:text-white">
                {task.due_date ? formatDate(task.due_date) : "Not set"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-500" /> Due Time
              </span>
              <span className="mt-1.5 inline-block font-bold text-slate-900 dark:text-white">
                {task.due_time ? formatTime(task.due_time) : "Not set"}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
            <span>Created: {new Date(task.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
            <span>Last Updated: {new Date(task.updated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Task</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleComplete(task);
                onClose();
              }}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md",
                isCompleted
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 shadow-emerald-600/20"
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
