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
import { Calendar, Clock, Edit2, Trash2, Check, AlertCircle, Eye } from "lucide-react";

interface TaskRowProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export function TaskRow({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
}: TaskRowProps) {
  const isCompleted = task.status === "completed";
  const overdue = isTaskOverdue(task);

  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border transition-all duration-200 hover:shadow-sm",
        isCompleted
          ? "border-border/50 bg-muted/20 opacity-80"
          : overdue
          ? "border-red-500/30 bg-red-500/[0.02]"
          : "border-border/80 hover:border-border"
      )}
    >
      {/* Left: Checkbox + Title + Description */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className={cn(
            "mt-0.5 sm:mt-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40",
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10 text-transparent"
          )}
          aria-label={isCompleted ? "Mark incomplete" : "Mark completed"}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewDetails(task)}
        >
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-semibold tracking-tight transition-colors truncate",
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-foreground group-hover:text-primary"
              )}
            >
              {task.title}
            </h4>
            {overdue && !isCompleted && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground truncate max-w-xl mt-0.5">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Badges, Due Date, and Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider",
              getPriorityBadgeColor(task.priority)
            )}
          >
            {task.priority}
          </span>
          <span
            className={cn(
              "hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border",
              getCategoryBadgeColor(task.category)
            )}
          >
            {task.category}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize",
              getStatusBadgeColor(task.status)
            )}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className={overdue && !isCompleted ? "text-red-500 font-semibold" : ""}>
              {formatDate(task.due_date)}
            </span>
            {task.due_time && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTime(task.due_time)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(task)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="View Details"
            aria-label="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
