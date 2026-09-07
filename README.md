# TaskFlow — Modern Full-Stack Task Management Platform

> **Plan. Track. Complete.**  
> A production-grade SaaS task management application built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL with Row Level Security (RLS).

---

## 🌟 Overview

**TaskFlow** is a modern productivity and sprint management platform designed for students, software engineers, and professionals. It provides robust authentication, data isolation through PostgreSQL Row-Level Security, multi-view task organization (List, Grid, and Kanban), an interactive Calendar, and real-time velocity analytics.

---

## ✨ Features

- **Full-Stack Architecture**: Built on Next.js 14 App Router with TypeScript and REST API routes (`/api/tasks`, `/api/tasks/[id]`, `/api/analytics`, `/api/profile`).
- **PostgreSQL Row Level Security (RLS)**: Cryptographically secured tenant separation. Users can strictly only view, create, edit, and delete their own tasks.
- **Supabase Authentication**: Persistent session management with email/password authentication, validation, and profile provisioning triggers.
- **Three Task Management Views**:
  - **List View**: High-density tabular layout with priority pills, status badges, and quick actions.
  - **Grid View**: Clean card interface with descriptions, due dates, timestamps, and quick completion.
  - **Kanban Board**: Drag or transition tasks across **To Do**, **In Progress**, and **Completed** columns.
- **Interactive Calendar**: Monthly/weekly grid displaying scheduled deadlines with priority color coding. Click any date to schedule a task directly.
- **Productivity Analytics (Recharts)**:
  - Velocity Area/Bar chart displaying tasks completed per day over the week.
  - Category workload distribution donut chart.
  - Dynamic completion rate percentage and overdue warnings.
- **Dynamic Search & Multi-Filters**:
  - Instant debounced search across title, description, and tags.
  - Composable filters: Status (All/Todo/In Progress/Completed), Priority (All/Low/Medium/High/Urgent), Category (College/Personal/Project/Coding/Assignment/Other), and Due Date (Today/This Week/Upcoming/Overdue).
  - Sorting: Newest, Oldest, Due Date, Priority, and Recently Updated.
- **Dark Mode & Theming**: Light, Dark, and System preference support powered by `next-themes` with zero flicker.
- **Toast Notifications**: Interactive feedback via `sonner` for task creation, status updates, deletions, and overdue alerts.
- **Automated Sample Seeding**: New accounts receive sample tasks ("Complete Java Assignment", "Practice DSA", "Finish AI/ML Project") for an immediate hands-on experience.
- **Responsive SaaS UI**: Mobile drawer and desktop sidebar layouts with accessible focus states and skeleton loading screens.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Data Visualization** | Recharts (Responsive charts) |
| **Theme & UI** | next-themes, sonner (Toasts), clsx, tailwind-merge |
| **Backend / API** | Next.js Route Handlers (REST architecture) |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Security** | PostgreSQL Row Level Security (RLS) policies |

---

## 🗄️ Database Schema & RLS

The database consists of two primary tables in PostgreSQL:

### `public.profiles`
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### `public.tasks`
```sql
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 3),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL DEFAULT 'Personal',
  due_date DATE,
  due_time TIME,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMPTZ
);
```

### Row Level Security (RLS)
Both tables have RLS enabled. Users can only perform `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on rows where `user_id = auth.uid()`.

The complete schema with indexes and triggers is located in [`supabase/schema.sql`](./supabase/schema.sql).

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd taskflow
npm install
```

### 2. Configure Supabase

1. Create a free project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) and paste the contents into the SQL Editor, then click **Run**.
4. In your Supabase project, navigate to **Project Settings** -> **API**.
5. Copy your **Project URL** and **Anon / Public Key**.

### 3. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note**: If you run the app without Supabase credentials, TaskFlow automatically enables **Local Demo Mode** using browser persistence so you can test all features immediately!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

To build the project for production:

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
taskflow/
├── app/
│   ├── page.tsx                     # Premium SaaS Landing Page
│   ├── layout.tsx                   # ThemeProvider, AuthProvider, Toaster
│   ├── globals.css                  # Modern Tailwind CSS variables
│   ├── login/page.tsx               # Login with validation & demo fill
│   ├── register/page.tsx            # Registration with sample task seeding
│   ├── dashboard/page.tsx           # Dynamic greeting, stats cards, Recharts velocity
│   ├── tasks/page.tsx               # Dedicated task management (List, Grid, Kanban)
│   ├── calendar/page.tsx            # Monthly interactive calendar
│   ├── profile/page.tsx             # User profile, presets & password update
│   └── api/
│       ├── tasks/
│       │   ├── route.ts             # GET (filters) & POST (create)
│       │   └── [id]/route.ts        # GET, PUT, DELETE with ownership checks
│       ├── analytics/route.ts       # Aggregated stats & chart datasets
│       └── profile/route.ts         # User profile update endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Top navigation (notifications, avatar, dynamic greeting)
│   │   ├── Sidebar.tsx              # Responsive sidebar & mobile navigation
│   │   └── ThemeToggle.tsx          # Light / Dark / System switcher
│   ├── tasks/
│   │   ├── TaskCard.tsx             # Grid card with checkbox, badges, menu
│   │   ├── TaskRow.tsx              # List view row
│   │   ├── TaskKanban.tsx           # Kanban board (Todo, In Progress, Completed)
│   │   ├── TaskModal.tsx            # Create / Edit modal with validation
│   │   ├── TaskDetailsModal.tsx     # Full task details view
│   │   ├── DeleteConfirmModal.tsx   # Delete confirmation prompt
│   │   ├── TaskFilters.tsx          # Status, Priority, Category, Date filter pills
│   │   └── TaskSearchSort.tsx       # Search bar and sort dropdown
│   ├── dashboard/
│   │   ├── StatsCard.tsx            # 4 Metric cards (Total, Completed, Pending, Overdue)
│   │   ├── CompletionChart.tsx      # Recharts weekly completed tasks per day
│   │   └── CategoryDonut.tsx        # Visual breakdown of tasks by category
│   ├── calendar/
│   │   └── CalendarGrid.tsx         # Monthly interactive calendar grid
│   └── ui/
│       ├── SkeletonLoaders.tsx      # Skeletons for dashboard, tasks, calendar
│       └── EmptyState.tsx           # Catchy empty states ("You're all caught up! 🎉")
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client with fallback detection
│   │   ├── server.ts                # Server Supabase client using @supabase/ssr
│   │   └── middleware.ts            # Auth protection middleware
│   ├── auth-context.tsx             # React Auth context & session provider
│   ├── task-service.ts              # Unified task service with Supabase + fallback adapter
│   └── utils.ts                     # Formatting, priority colors, badge helpers
├── types/
│   └── index.ts                     # TypeScript interfaces
├── supabase/
│   └── schema.sql                   # Database DDL, RLS policies, indexes, and triggers
├── .env.example
└── package.json
```

---

## 🛡️ Security Best Practices Implemented

1. **Strict Row Level Security (RLS)**: No user can access or mutate another user's task or profile data.
2. **Server-Side Validation**: Titles require minimum 3 characters, valid priority enum, and valid status enum.
3. **No Trust of Client-Provided User IDs**: The authenticated user ID is derived directly from the verified auth session.
4. **Environment Secrets**: Sensitive keys are kept in `.env.local` and never hard-coded.

---

## 📄 License

This project is licensed under the MIT License.
