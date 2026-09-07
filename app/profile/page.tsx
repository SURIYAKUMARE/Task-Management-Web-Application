"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TaskService } from "@/lib/task-service";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Save,
  CheckCircle2,
  Layers,
  Award,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, updateProfile, updatePassword, isConfigured, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Lifetime Stats
  const [stats, setStats] = useState({ total: 0, completed: 0, completionRate: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
    } else if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`);
    }

    if (user) {
      TaskService.getTasks(user.id).then((tasks) => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === "completed").length;
        setStats({
          total,
          completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        });
      });
    }
  }, [user, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    try {
      setUpdatingProfile(true);
      const { error } = await updateProfile({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setUpdatingPassword(true);
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const PRESET_AVATARS = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user1"}`,
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  ];

  const creationDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 2026";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <UserIcon className="w-6 h-6 text-primary" />
              <span>Account Settings & Profile</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your personal identity, credentials, and track your all-time productivity record
            </p>
          </div>

          {/* User Overview Card */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "taskflow"}`}
                alt={fullName || "User Avatar"}
                className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 object-cover shadow-md"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {fullName || "TaskFlow User"}
                </h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary self-center sm:self-auto">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isConfigured ? "Verified Auth" : "Portfolio Mode"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {user?.email || "user@taskflow.dev"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Member since {creationDate}
                </span>
              </div>

              {/* Avatar Preset Selector */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Choose avatar preset:
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`p-0.5 rounded-xl border-2 transition-all ${
                        avatarUrl === url
                          ? "border-primary scale-110 shadow-xs"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preset ${i}`} className="w-8 h-8 rounded-lg bg-muted" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Productivity Lifetime Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">{stats.total}</span>
                <p className="text-xs text-muted-foreground font-medium">Total Tasks Created</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">{stats.completed}</span>
                <p className="text-xs text-muted-foreground font-medium">Tasks Completed</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">{stats.completionRate}%</span>
                <p className="text-xs text-muted-foreground font-medium">Overall Completion Rate</p>
              </div>
            </div>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edit Profile Form */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="pb-3 border-b border-border/60">
                <h3 className="text-base font-bold text-foreground">Personal Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your public display name and avatar image
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Custom Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/20 border border-border text-xs text-muted-foreground cursor-not-allowed"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Email cannot be changed directly for security integrity.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
                  >
                    {updatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="pb-3 border-b border-border/60">
                <h3 className="text-base font-bold text-foreground">Security & Password</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your authentication credentials
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors shadow-xs"
                  >
                    {updatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 text-primary" />
                    )}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
