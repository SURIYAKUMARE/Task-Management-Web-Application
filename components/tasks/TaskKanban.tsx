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
  const columns: { status: TaskStatus; title: string; dotColor: string; badgeBg: string }[] = [
    {
      status: "todo",
      title: "To Do",
      dotColor: "bg-slate-400",
      badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    },
    {
      status: "in_progress",
      title: "In Progress",
      dotColor: "bg-indigo-500",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40",
    },
    {
      status: "completed",
      title: "Completed",
      dotColor: "bg-emerald-500",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);

        return (
          <div
            key={column.status}
            className="flex flex-col rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  {column.title}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${column.badgeBg}`}>
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreateWithStatus(column.status)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${column.title}`}
                aria-label={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium">No tasks here</p>
                  <button
                    type="button"
                    onClick={() => onOpenCreateWithStatus(column.status)}
                    className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add a task
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban space-y-1.5">
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                    />

                    {/* Quick Move Buttons */}
                    <div className="flex items-center justify-end gap-1.5 text-[11px] px-1">
                      {column.status !== "todo" && (
                        <button
                          type="button"
                          onClick={() => {
                            const prevStatus = column.status === "completed" ? "in_progress" : "todo";
                            onMoveStatus(task, prevStatus);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors shadow-2xs font-semibold"
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
                          type="button"
                          onClick={() => {
                            const nextStatus = column.status === "todo" ? "in_progress" : "completed";
                            onMoveStatus(task, nextStatus);
                          }}
                          className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 transition-colors font-bold shadow-2xs"
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
