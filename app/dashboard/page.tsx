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
  Bell,
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-card to-indigo-500/10 p-5 sm:p-6 rounded-3xl border border-primary/20 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Productivity Command Center</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">
                {getTimeGreeting()}, {userName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Let&apos;s make today productive. You have{" "}
                <span className="font-bold text-foreground">{stats.pending}</span> pending{" "}
                {stats.pending === 1 ? "task" : "tasks"}
                {stats.overdue > 0 && (
                  <span className="text-red-500 font-bold ml-1">
                    ({stats.overdue} overdue)
                  </span>
                )}
                .
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all active:scale-[0.98]"
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
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  You have {stats.overdue} overdue {stats.overdue === 1 ? "task" : "tasks"} requiring immediate attention.
                </span>
              </div>
              <Link
                href="/tasks"
                className="shrink-0 text-center px-3 py-1.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors"
              >
                View Overdue
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
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>Immediate Focus & Upcoming</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tasks pending execution on your agenda
                </p>
              </div>

              <Link
                href="/tasks"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>View All ({stats.total})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 rounded-2xl bg-card border border-border animate-pulse" />
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
