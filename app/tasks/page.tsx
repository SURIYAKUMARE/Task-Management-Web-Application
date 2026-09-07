"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TaskService } from "@/lib/task-service";
import {
  Task,
  TaskViewMode,
  FilterOptions,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskRow } from "@/components/tasks/TaskRow";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { TaskSearchSort } from "@/components/tasks/TaskSearchSort";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { TaskListSkeleton } from "@/components/ui/SkeletonLoaders";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlusCircle, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<TaskViewMode>("grid");

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
    dateFilter: "all",
    sortBy: "newest",
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>("todo");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userTasks = await TaskService.getTasks(user.id);
      setTasks(userTasks);
    } catch (err) {
      console.error("Error loading tasks", err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  // Filter & Sort tasks
  const filteredTasks = useMemo(() => {
    return TaskService.filterAndSortTasks(tasks, filters);
  }, [tasks, filters]);

  // Actions
  const handleToggleComplete = async (task: Task) => {
    if (!user) return;
    const isNowCompleted = task.status !== "completed";
    const newStatus: TaskStatus = isNowCompleted ? "completed" : "todo";

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              completed_at: isNowCompleted ? new Date().toISOString() : null,
            }
          : t
      )
    );

    const { error } = await TaskService.updateTask(user.id, task.id, {
      status: newStatus,
    });

    if (error) {
      toast.error(error);
      loadTasks();
    } else {
      if (isNowCompleted) {
        toast.success(`"${task.title}" completed! 🎉`);
      } else {
        toast.info(`"${task.title}" reopened.`);
      }
    }
  };

  const handleMoveStatus = async (task: Task, newStatus: TaskStatus) => {
    if (!user) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              completed_at: newStatus === "completed" ? new Date().toISOString() : null,
            }
          : t
      )
    );

    const { error } = await TaskService.updateTask(user.id, task.id, {
      status: newStatus,
    });

    if (error) {
      toast.error(error);
      loadTasks();
    } else {
      toast.success(`Moved to ${newStatus.replace("_", " ")}`);
    }
  };

  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory | string;
    due_date?: string;
    due_time?: string;
  }) => {
    if (!user) return;

    if (taskToEdit) {
      const { error } = await TaskService.updateTask(user.id, taskToEdit.id, taskData);
      if (error) throw new Error(error);
      toast.success("Task updated successfully!");
    } else {
      const { error } = await TaskService.createTask(user.id, taskData);
      if (error) throw new Error(error);
      toast.success("Task created successfully! 🚀");
    }

    setTaskToEdit(null);
    loadTasks();
  };

  const handleDeleteTask = async () => {
    if (!user || !taskToDelete) return;
    try {
      setDeleteLoading(true);
      const { error } = await TaskService.deleteTask(user.id, taskToDelete.id);
      if (error) throw new Error(error);
      toast.success("Task deleted successfully.");
      setTaskToDelete(null);
      loadTasks();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.dateFilter !== "all";

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
      dateFilter: "all",
      sortBy: "newest",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setModalDefaultStatus("todo");
            setIsCreateModalOpen(true);
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-6">
          {/* Header & Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <CheckSquare className="w-6 h-6 text-primary" />
                <span>Task Management</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Organize, search, filter, and track all your tasks across List, Grid, and Kanban views
              </p>
            </div>

            <button
              onClick={() => {
                setTaskToEdit(null);
                setModalDefaultStatus("todo");
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Search, Sort, and View Controls */}
          <div className="space-y-3 bg-card border border-border/80 p-4 rounded-3xl shadow-xs">
            <TaskSearchSort
              search={filters.search}
              onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
              sortBy={filters.sortBy}
              onSortChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
              viewMode={viewMode}
              onViewModeChange={(m) => setViewMode(m)}
              totalTasks={tasks.length}
              filteredTasksCount={filteredTasks.length}
            />

            {/* Filter Pills */}
            <TaskFilters
              filters={filters}
              onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Task View Content */}
          {loading ? (
            <TaskListSkeleton />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onAction={() => {
                setTaskToEdit(null);
                setModalDefaultStatus("todo");
                setIsCreateModalOpen(true);
              }}
              onClearFilters={handleResetFilters}
            />
          ) : viewMode === "list" ? (
            /* List View */
            <div className="space-y-2.5 animate-fade-in">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(t) => {
                    setTaskToEdit(t);
                    setIsCreateModalOpen(true);
                  }}
                  onDelete={(t) => setTaskToDelete(t)}
                  onViewDetails={(t) => setTaskToView(t)}
                />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(t) => {
                    setTaskToEdit(t);
                    setIsCreateModalOpen(true);
                  }}
                  onDelete={(t) => setTaskToDelete(t)}
                  onViewDetails={(t) => setTaskToView(t)}
                />
              ))}
            </div>
          ) : (
            /* Kanban View */
            <div className="animate-fade-in">
              <TaskKanban
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsCreateModalOpen(true);
                }}
                onDelete={(t) => setTaskToDelete(t)}
                onViewDetails={(t) => setTaskToView(t)}
                onMoveStatus={handleMoveStatus}
                onOpenCreateWithStatus={(st) => {
                  setTaskToEdit(null);
                  setModalDefaultStatus(st);
                  setIsCreateModalOpen(true);
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={modalDefaultStatus}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={Boolean(taskToView)}
        task={taskToView}
        onClose={() => setTaskToView(null)}
        onEdit={(t) => {
          setTaskToView(null);
          setTaskToEdit(t);
          setIsCreateModalOpen(true);
        }}
        onDelete={(t) => {
          setTaskToView(null);
          setTaskToDelete(t);
        }}
        onToggleComplete={handleToggleComplete}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        loading={deleteLoading}
      />
    </div>
  );
}
