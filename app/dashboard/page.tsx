"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { TaskService } from "@/lib/task-service";
import { NotificationService } from "@/lib/notification-service";
import { Task, TaskStats, DayCompletionData, TaskPriority, TaskCategory, TaskStatus } from "@/types";
import { getTimeGreeting } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatsCards } from "@/components/dashboard/StatsCard";
import { CompletionChart } from "@/components/dashboard/CompletionChart";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { StatsSkeleton, ChartSkeleton } from "@/components/ui/SkeletonLoaders";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  PlusCircle,
  ArrowRight,
  Sparkles,
  Calendar as CalendarIcon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
    completedThisWeek: 0,
    createdThisWeek: 0,
  });
  const [chartData, setChartData] = useState<DayCompletionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userTasks = await TaskService.getTasks(user.id);
      setTasks(userTasks);
      setStats(TaskService.calculateStats(userTasks));
      setChartData(TaskService.getWeeklyChartData(userTasks));

      // Check task reminders & overdue alerts
      NotificationService.checkTaskReminders(userTasks);
    } catch (err) {
      console.error("Failed to load dashboard tasks", err);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Actions
  const handleToggleComplete = async (task: Task) => {
    if (!user) return;
    const isNowCompleted = task.status !== "completed";
    const newStatus: TaskStatus = isNowCompleted ? "completed" : "todo";

    // Optimistic update
    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? {
            ...t,
            status: newStatus,
            completed_at: isNowCompleted ? new Date().toISOString() : null,
          }
        : t
    );
    setTasks(updatedTasks);
    setStats(TaskService.calculateStats(updatedTasks));
    setChartData(TaskService.getWeeklyChartData(updatedTasks));

    const { error } = await TaskService.updateTask(user.id, task.id, {
      status: newStatus,
    });

    if (error) {
      toast.error(error);
      loadDashboardData();
    } else {
      if (isNowCompleted) {
        toast.success(`"${task.title}" completed! 🎉`);
      } else {
        toast.info(`"${task.title}" marked active.`);
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
      toast.success("Task created successfully! 🚀");
    }

    setTaskToEdit(null);
    loadDashboardData();
  };

  const handleDeleteTask = async () => {
    if (!user || !taskToDelete) return;
    try {
      setDeleteLoading(true);
      const { error } = await TaskService.deleteTask(user.id, taskToDelete.id);
      if (error) throw new Error(error);
      toast.success("Task deleted successfully.");
      setTaskToDelete(null);
      loadDashboardData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const userName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Suriyakumar";

  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed")
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
        tasks={tasks}
        onSelectTask={(t) => setTaskToView(t)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setIsCreateModalOpen(true);
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-8 pb-24 md:pb-8">
          {/* Welcome Greeting Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30 p-6 sm:p-8 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Productivity Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {getTimeGreeting()}, {userName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Let&apos;s make today productive. You have{" "}
                <span className="font-bold text-slate-900 dark:text-white">{stats.pending}</span> pending{" "}
                {stats.pending === 1 ? "task" : "tasks"}
                {stats.overdue > 0 && (
                  <span className="text-red-500 font-bold ml-1">
                    ({stats.overdue} overdue)
                  </span>
                )}
                .
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTaskToEdit(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          {/* 4 Key Statistics Cards */}
          {loading ? <StatsSkeleton /> : <StatsCards stats={stats} />}

          {/* Overdue Banner if any */}
          {stats.overdue > 0 && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-xs">
              <div className="flex items-center gap-2.5 text-red-700 dark:text-red-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>
                  You have {stats.overdue} overdue {stats.overdue === 1 ? "task" : "tasks"} requiring immediate attention.
                </span>
              </div>
              <Link
                href="/tasks"
                className="shrink-0 text-center px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-md shadow-red-600/20 transition-all"
              >
                View Overdue Tasks
              </Link>
            </div>
          )}

          {/* Productivity Analytics & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <CompletionChart
                  data={chartData}
                  completionRate={stats.completionRate}
                />
              )}
            </div>

            <div>
              {loading ? (
                <ChartSkeleton />
              ) : (
                <CategoryDonut tasks={tasks} />
              )}
            </div>
          </div>

          {/* Today & Upcoming Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-500" />
                  <span>Immediate Focus & Upcoming</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Tasks pending execution on your agenda
                </p>
              </div>

              <Link
                href="/tasks"
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>View All ({stats.total})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <EmptyState
                onAction={() => {
                  setTaskToEdit(null);
                  setIsCreateModalOpen(true);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTasks.map((task) => (
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
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        onOpenCreateTask={() => {
          setTaskToEdit(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
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
