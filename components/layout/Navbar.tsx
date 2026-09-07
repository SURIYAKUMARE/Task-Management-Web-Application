"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getTimeGreeting } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { Task } from "@/types";
import {
  CheckCircle2,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Calendar,
  LayoutDashboard,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  tasks?: Task[];
  onSelectTask?: (task: Task) => void;
}

export function Navbar({
  onMobileMenuToggle,
  isMobileMenuOpen,
  tasks = [],
  onSelectTask,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isConfigured } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      toast.error("Error signing out");
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Productive User";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "guest"}`;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-card/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand + Desktop Links */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  TaskFlow
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:inline">
                  Plan • Track • Complete
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 pl-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Dynamic Greeting + Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dynamic user greeting for desktop */}
            <div className="hidden lg:flex flex-col text-right pr-2">
              <span className="text-xs font-semibold text-foreground">
                {getTimeGreeting()}, {displayName.split(" ")[0]} 👋
              </span>
              <span className="text-[11px] text-muted-foreground">
                Let&apos;s make today productive.
              </span>
            </div>

            {/* Enhanced Notifications Center */}
            <NotificationCenter tasks={tasks} onSelectTask={onSelectTask} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Avatar & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-muted/70 transition-all border border-border/60 focus:outline-none"
                aria-label="User profile menu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-7 h-7 rounded-lg bg-primary/10 object-cover"
                />
                <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                  {displayName}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-border/60">
                    <p className="text-xs font-semibold truncate text-foreground">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {isConfigured ? "Supabase Connected" : "Local Mode"}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      My Profile & Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
