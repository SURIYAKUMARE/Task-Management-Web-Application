"use client";

import React from "react";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";

interface TaskKanbanProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onMoveStatus: (task: Task, newStatus: TaskStatus) => void;
  onOpenCreateWithStatus: (status: TaskStatus) => void;
}

export function TaskKanban({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  onMoveStatus,
  onOpenCreateWithStatus,
}: TaskKanbanProps) {
  const columns: { status: TaskStatus; title: string; color: string; badgeBg: string }[] = [
    {
      status: "todo",
      title: "To Do",
      color: "border-slate-500/40 text-slate-600 dark:text-slate-400",
      badgeBg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    {
      status: "in_progress",
      title: "In Progress",
      color: "border-indigo-500/40 text-indigo-600 dark:text-indigo-400",
      badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    },
    {
      status: "completed",
      title: "Completed",
      color: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);

        return (
          <div
            key={column.status}
            className="flex flex-col rounded-3xl bg-card/60 border border-border/70 p-4 min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  column.status === "todo"
                    ? "bg-slate-400"
                    : column.status === "in_progress"
                    ? "bg-indigo-500"
                    : "bg-emerald-500"
                }`} />
                <h3 className="font-bold text-sm tracking-tight text-foreground">
                  {column.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${column.badgeBg}`}>
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenCreateWithStatus(column.status)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={`Add task to ${column.title}`}
                aria-label={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border/70 rounded-2xl">
                  <p className="text-xs text-muted-foreground">No tasks here</p>
                  <button
                    onClick={() => onOpenCreateWithStatus(column.status)}
                    className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add a task
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban">
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                    />

                    {/* Quick Move Buttons */}
                    <div className="mt-1.5 flex items-center justify-end gap-1 text-[11px]">
                      {column.status !== "todo" && (
                        <button
                          onClick={() => {
                            const prevStatus = column.status === "completed" ? "in_progress" : "todo";
                            onMoveStatus(task, prevStatus);
                          }}
                          className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span className="capitalize text-[10px]">
                            {column.status === "completed" ? "In Progress" : "To Do"}
                          </span>
                        </button>
                      )}

                      {column.status !== "completed" && (
                        <button
                          onClick={() => {
                            const nextStatus = column.status === "todo" ? "in_progress" : "completed";
                            onMoveStatus(task, nextStatus);
                          }}
                          className="px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1 transition-colors font-medium"
                          title="Move right"
                        >
                          <span className="capitalize text-[10px]">
                            {column.status === "todo" ? "In Progress" : "Complete"}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
