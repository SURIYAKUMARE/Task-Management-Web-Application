"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Kanban,
  BarChart3,
  Search,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  Database,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                TaskFlow
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Plan • Track • Complete
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Production-Quality Task Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Plan effortlessly. <br />
            Track seamlessly. <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Complete fearlessly.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            TaskFlow combines full-stack architecture, Supabase PostgreSQL Row Level Security, dynamic List, Grid & Kanban views, interactive Calendar, and real-time productivity analytics into one unified SaaS platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-95 transition-all hover:scale-[1.02]"
            >
              <span>Start Free with Demo Data</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors shadow-xs"
            >
              Sign In to Existing Account
            </Link>
          </div>

          {/* Interactive Mockup Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card/60 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-2">app.taskflow.dev/tasks</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL • RLS Enabled</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-left">
              {/* Sample Card 1 */}
              <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-bold border border-red-500/20">URGENT</span>
                  <span className="text-muted-foreground">Due in 2 days</span>
                </div>
                <h4 className="text-xs font-bold text-foreground">Finish AI/ML Project Deployment</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">Containerize pipeline with FastAPI and deploy to staging.</p>
                <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted">Project</span>
                  <span className="text-indigo-500 font-medium">In Progress</span>
                </div>
              </div>

              {/* Sample Card 2 */}
              <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">HIGH</span>
                  <span className="text-muted-foreground">Due Tomorrow</span>
                </div>
                <h4 className="text-xs font-bold text-foreground">Complete Java Assignment</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">Implement multi-threading and concurrency locks.</p>
                <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted">College</span>
                  <span className="text-slate-500 font-medium">To Do</span>
                </div>
              </div>

              {/* Sample Card 3 */}
              <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs opacity-85">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">LOW</span>
                  <span className="text-emerald-500 font-semibold">Done Today</span>
                </div>
                <h4 className="text-xs font-bold text-muted-foreground line-through">System Architecture Review</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">Study distributed caching and database replication patterns.</p>
                <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted">Personal</span>
                  <span className="text-emerald-600 font-semibold">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Capabilities</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineered for seamless productivity
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to orchestrate personal tasks, academic deadlines, and engineering sprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">PostgreSQL Row-Level Security</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Guaranteed cryptographic tenant isolation. Every SELECT, INSERT, UPDATE, and DELETE query enforces strict authenticated user ownership at the PostgreSQL kernel level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Tri-View Workspace</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Switch effortlessly between high-density List view, visual Grid cards, and interactive Kanban boards to prioritize tasks your way.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Interactive Calendar</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Visualize deadlines across monthly and weekly perspectives. Click any day to instantly schedule or review prioritized tasks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Productivity Analytics</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Built-in Recharts velocity charts track tasks completed per day, calculate dynamic completion ratios, and visualize category distribution.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Smart Filters & Search</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Instantly search across title, description, and tags while combining status, priority, category, and date filters with zero lag.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Real-Time & Toast Feedback</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Instant optimistic UI updates with sonner toast notifications and automatic overdue deadline detection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Workflow</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              How TaskFlow works in 3 steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-foreground">Plan & Categorize</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Add your tasks with priorities (Low, Medium, High, Urgent), categories, due dates, and exact times.
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-foreground">Track & Execute</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Organize work with Kanban columns, filter upcoming deadlines, and inspect interactive calendar views.
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-foreground">Complete & Analyze</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Check off items with one click and watch your productivity velocity and completion statistics update instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Statistics */}
      <section className="py-16 bg-card border-y border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-foreground">100%</span>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Data Privacy via RLS</p>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-primary">0ms</span>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Optimistic UI Latency</p>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-foreground">3 Views</span>
              <p className="text-xs text-muted-foreground mt-1 font-medium">List, Grid & Kanban</p>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-emerald-500">99.9%</span>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-primary/10 via-card to-indigo-500/10 border border-primary/20 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Ready to elevate your productivity?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Join TaskFlow today. Your account comes pre-seeded with sample tasks so you can start organizing in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/25 hover:opacity-90 transition-all"
              >
                <span>Create Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/70 py-8 bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-white text-[10px] font-bold">
              TF
            </div>
            <span className="font-semibold text-foreground">TaskFlow</span>
            <span>— Plan. Track. Complete.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono">Next.js 14</span>
            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono">TypeScript</span>
            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono">Supabase PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
