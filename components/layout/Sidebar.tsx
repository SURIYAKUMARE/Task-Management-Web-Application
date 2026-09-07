"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  User as UserIcon,
  PlusCircle,
  Database,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  onOpenCreateTask?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ onOpenCreateTask, isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { isConfigured } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border p-5 transform transition-transform duration-200 ease-in-out md:hidden ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 pb-6 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
              TF
            </div>
            <span className="font-bold text-lg">TaskFlow</span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                onCloseMobile?.();
                onOpenCreateTask?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          <nav className="mt-6 space-y-1.5 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>{isConfigured ? "PostgreSQL Active" : "Local Demo Mode"}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isConfigured
                ? "Row-Level Security verified."
                : "Add keys in .env.local for Supabase sync."}
            </p>
          </div>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/80 bg-card/50 min-h-[calc(100vh-4rem)] p-5">
        {/* Quick action button */}
        <button
          onClick={onOpenCreateTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.99]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Task</span>
        </button>

        {/* Navigation list */}
        <nav className="mt-6 space-y-1.5 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Database status banner card */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-primary/10 border border-primary/20 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              {isConfigured ? "Cloud Synced" : "Portfolio Mode"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            {isConfigured
              ? "Secured with Supabase Auth & PostgreSQL Row-Level Security."
              : "Explore full CRUD features. Connect Supabase anytime for live cloud sync."}
          </p>
        </div>
      </aside>
    </>
  );
}
