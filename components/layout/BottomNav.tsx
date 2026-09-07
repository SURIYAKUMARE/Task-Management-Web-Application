"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  User,
  Plus,
} from "lucide-react";

interface BottomNavProps {
  onOpenCreateTask?: () => void;
}

export function BottomNav({ onOpenCreateTask }: BottomNavProps) {
  const pathname = usePathname();

  // Don't show bottom nav on login, register, or landing page
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border/80 px-2 py-1.5 shadow-2xl transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* First 2 items */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Floating Action Button (FAB) */}
        <button
          type="button"
          onClick={onOpenCreateTask}
          aria-label="Create new task"
          className="relative -top-3 w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-primary/35 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Last 2 items */}
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
