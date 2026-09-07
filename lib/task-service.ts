import { Task, FilterOptions, TaskStats, DayCompletionData, TaskPriority } from "@/types";
import { createClient, isSupabaseConfigured } from "./supabase/client";

const DEMO_TASKS_KEY_PREFIX = "taskflow_demo_tasks_";

const INITIAL_DEMO_TASKS = (userId: string): Task[] => {
  const today = new Date();
  const formatIsoDate = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return [
    {
      id: "demo-task-1",
      user_id: userId,
      title: "Complete Java Assignment",
      description: "Implement multi-threading, concurrency locks, and design patterns for the semester laboratory submission.",
      status: "todo",
      priority: "high",
      category: "College",
      due_date: formatIsoDate(2),
      due_time: "18:00",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
    {
      id: "demo-task-2",
      user_id: userId,
      title: "Practice DSA (Trees & Dynamic Programming)",
      description: "Solve 3 LeetCode Medium problems focusing on Binary Search Trees and dynamic programming memoization.",
      status: "in_progress",
      priority: "medium",
      category: "Coding",
      due_date: formatIsoDate(1),
      due_time: "20:30",
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
    {
      id: "demo-task-3",
      user_id: userId,
      title: "Finish AI/ML Project Deployment",
      description: "Containerize model inference pipeline with FastAPI, configure Dockerfile, and push image to production cluster.",
      status: "todo",
      priority: "urgent",
      category: "Project",
      due_date: formatIsoDate(3),
      due_time: "23:59",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
    {
      id: "demo-task-4",
      user_id: userId,
      title: "Review System Architecture Document",
      description: "Read chapter 4 on distributed caching, Redis pub/sub, and database replication.",
      status: "completed",
      priority: "low",
      category: "Personal",
      due_date: formatIsoDate(-1),
      due_time: "15:00",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];
};

export class TaskService {
  private static getLocalTasks(userId: string): Task[] {
    if (typeof window === "undefined") return [];
    const key = DEMO_TASKS_KEY_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) {
      const initial = INITIAL_DEMO_TASKS(userId);
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  private static setLocalTasks(userId: string, tasks: Task[]): void {
    if (typeof window === "undefined") return;
    const key = DEMO_TASKS_KEY_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(tasks));
  }

  // Fetch all tasks for user
  static async getTasks(userId: string): Promise<Task[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks from Supabase:", error);
        return [];
      }

      // If new user and has 0 tasks, seed initial tasks
      if (data && data.length === 0) {
        const seedTasks = INITIAL_DEMO_TASKS(userId).map(({ id, ...rest }) => rest);
        const { data: seeded, error: seedError } = await supabase
          .from("tasks")
          .insert(seedTasks)
          .select();
        if (!seedError && seeded) {
          return seeded as Task[];
        }
      }

      return (data || []) as Task[];
    } else {
      return this.getLocalTasks(userId);
    }
  }

  // Create task
  static async createTask(
    userId: string,
    taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<{ data: Task | null; error: string | null }> {
    if (!taskData.title || taskData.title.trim().length < 3) {
      return { data: null, error: "Task title must be at least 3 characters long." };
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const newTask = {
        user_id: userId,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        category: taskData.category || "Personal",
        due_date: taskData.due_date || null,
        due_time: taskData.due_time || null,
        completed_at: taskData.status === "completed" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert(newTask)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data: data as Task, error: null };
    } else {
      const newTask: Task = {
        id: "task-" + Date.now(),
        user_id: userId,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        category: taskData.category || "Personal",
        due_date: taskData.due_date || undefined,
        due_time: taskData.due_time || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: taskData.status === "completed" ? new Date().toISOString() : null,
      };

      const tasks = this.getLocalTasks(userId);
      const updated = [newTask, ...tasks];
      this.setLocalTasks(userId, updated);
      return { data: newTask, error: null };
    }
  }

  // Update task
  static async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
  ): Promise<{ data: Task | null; error: string | null }> {
    if (updates.title !== undefined && updates.title.trim().length < 3) {
      return { data: null, error: "Task title must be at least 3 characters long." };
    }

    const payload: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.status === "completed") {
      payload.completed_at = new Date().toISOString();
    } else if (updates.status === "todo" || updates.status === "in_progress") {
      payload.completed_at = null;
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", taskId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data: data as Task, error: null };
    } else {
      const tasks = this.getLocalTasks(userId);
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index === -1) {
        return { data: null, error: "Task not found" };
      }

      const updatedTask: Task = {
        ...tasks[index],
        ...payload,
      } as Task;

      tasks[index] = updatedTask;
      this.setLocalTasks(userId, tasks);
      return { data: updatedTask, error: null };
    }
  }

  // Delete task
  static async deleteTask(
    userId: string,
    taskId: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", userId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } else {
      const tasks = this.getLocalTasks(userId);
      const filtered = tasks.filter((t) => t.id !== taskId);
      this.setLocalTasks(userId, filtered);
      return { success: true, error: null };
    }
  }

  // Filter and sort tasks helper
  static filterAndSortTasks(tasks: Task[], options: FilterOptions): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const filtered = tasks.filter((task) => {
      // Search
      if (options.search) {
        const query = options.search.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = (task.description || "").toLowerCase().includes(query);
        const catMatch = task.category.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !catMatch) return false;
      }

      // Status
      if (options.status !== "all" && task.status !== options.status) {
        return false;
      }

      // Priority
      if (options.priority !== "all" && task.priority !== options.priority) {
        return false;
      }

      // Category
      if (options.category !== "all" && task.category.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }

      // Date Filter
      if (options.dateFilter !== "all") {
        if (!task.due_date) return false;
        const [y, m, d] = task.due_date.split("-").map(Number);
        const dueDate = new Date(y, m - 1, d);

        if (options.dateFilter === "today") {
          const isToday =
            dueDate.getFullYear() === today.getFullYear() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getDate() === today.getDate();
          if (!isToday) return false;
        } else if (options.dateFilter === "this_week") {
          if (dueDate < startOfWeek || dueDate > endOfWeek) return false;
        } else if (options.dateFilter === "upcoming") {
          if (dueDate <= today) return false;
        } else if (options.dateFilter === "overdue") {
          if (task.status === "completed" || dueDate >= today) return false;
        }
      }

      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      if (options.sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (options.sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (options.sortBy === "recently_updated") {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (options.sortBy === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      }
      if (options.sortBy === "priority") {
        const priorityWeight: Record<TaskPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });
  }

  // Calculate stats
  static calculateStats(tasks: Task[]): TaskStats {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "todo" || t.status === "in_progress").length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((t) => {
      if (t.status === "completed" || !t.due_date) return false;
      const [y, m, d] = t.due_date.split("-").map(Number);
      const dueDate = new Date(y, m - 1, d);
      return dueDate < today;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const completedThisWeek = tasks.filter((t) => {
      if (t.status !== "completed" || !t.completed_at) return false;
      return new Date(t.completed_at) >= oneWeekAgo;
    }).length;

    const createdThisWeek = tasks.filter((t) => {
      return new Date(t.created_at) >= oneWeekAgo;
    }).length;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      completedThisWeek,
      createdThisWeek,
    };
  }

  // Weekly chart data for Recharts
  static getWeeklyChartData(tasks: Task[]): DayCompletionData[] {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: DayCompletionData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = days[d.getDay()];

      const completedCount = tasks.filter((t) => {
        if (!t.completed_at) return false;
        return t.completed_at.startsWith(dateStr);
      }).length;

      const createdCount = tasks.filter((t) => {
        return t.created_at.startsWith(dateStr);
      }).length;

      result.push({
        date: dateStr,
        day: dayName,
        completed: completedCount,
        created: createdCount,
      });
    }

    return result;
  }
}
