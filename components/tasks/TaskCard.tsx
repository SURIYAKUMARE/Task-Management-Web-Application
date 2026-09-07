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
import { Calendar, Clock, Edit2, Trash2, Check, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const overdue = isTaskOverdue(task);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-card border p-5 transition-all duration-200 hover:shadow-md hover:border-border",
        isCompleted
          ? "border-border/50 bg-muted/20 opacity-80"
          : overdue
          ? "border-red-500/30 bg-red-500/[0.02]"
          : "border-border/80"
      )}
    >
      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
                getPriorityBadgeColor(task.priority)
              )}
            >
              {task.priority}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-medium border",
                getCategoryBadgeColor(task.category)
              )}
            >
              {task.category}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
                getStatusBadgeColor(task.status)
              )}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title and Checkbox */}
        <div className="flex items-start gap-3 mt-1 cursor-pointer" onClick={() => onViewDetails(task)}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task);
            }}
            className={cn(
              "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40",
              isCompleted
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10 text-transparent"
            )}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "text-sm font-semibold leading-snug tracking-tight transition-colors",
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-foreground group-hover:text-primary"
              )}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Dates & Due Time */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                overdue && !isCompleted ? "text-red-500 font-semibold" : ""
              )}
            >
              {overdue && !isCompleted ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Calendar className="w-3 h-3 text-muted-foreground" />
              )}
              {formatDate(task.due_date)}
            </span>
          )}
          {task.due_time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              {formatTime(task.due_time)}
            </span>
          )}
        </div>

        <span className="text-[10px] text-muted-foreground/80">
          Added {new Date(task.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
