"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TaskService } from "@/lib/task-service";
import { Task, TaskPriority, TaskCategory, TaskStatus } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { CalendarSkeleton } from "@/components/ui/SkeletonLoaders";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      console.error("Error loading calendar tasks", err);
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

  const handleToggleComplete = async (task: Task) => {
    if (!user) return;
    const isNowCompleted = task.status !== "completed";
    const newStatus: TaskStatus = isNowCompleted ? "completed" : "todo";

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
      toast.success("Task scheduled successfully! 🚀");
    }

    setTaskToEdit(null);
    setSelectedDate(undefined);
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

  const handleCreateOnDate = (dateStr: string) => {
    setTaskToEdit(null);
    setSelectedDate(dateStr);
    setIsCreateModalOpen(true);
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
            setSelectedDate(undefined);
            setIsCreateModalOpen(true);
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <span>Calendar Schedule</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                View due dates, schedule deadlines, and manage upcoming priorities
              </p>
            </div>

            <button
              onClick={() => {
                setTaskToEdit(null);
                setSelectedDate(undefined);
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Task</span>
            </button>
          </div>

          {loading ? (
            <CalendarSkeleton />
          ) : (
            <CalendarGrid
              tasks={tasks}
              onSelectTask={(task) => setTaskToView(task)}
              onCreateTaskOnDate={handleCreateOnDate}
            />
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
          setSelectedDate(undefined);
        }}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultDate={selectedDate}
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
