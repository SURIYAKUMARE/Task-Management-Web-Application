export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskCategory =
  | 'College'
  | 'Personal'
  | 'Project'
  | 'Coding'
  | 'Assignment'
  | 'Other';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory | string;
  due_date?: string; // YYYY-MM-DD
  due_time?: string; // HH:mm
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type TaskViewMode = 'list' | 'grid' | 'kanban';

export type DateFilter = 'all' | 'today' | 'this_week' | 'upcoming' | 'overdue';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'due_date'
  | 'priority'
  | 'recently_updated';

export interface FilterOptions {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: string | 'all';
  dateFilter: DateFilter;
  sortBy: SortOption;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  completedThisWeek: number;
  createdThisWeek: number;
}

export interface DayCompletionData {
  date: string;
  day: string;
  completed: number;
  created: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}
