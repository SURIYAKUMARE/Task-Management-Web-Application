"use client";

import React, { useState, useEffect, useRef } from "react";
import { Task } from "@/types";
import { NotificationService } from "@/lib/notification-service";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Volume2,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { isTaskOverdue, isTaskDueToday } from "@/lib/utils";

interface NotificationCenterProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
}

export function NotificationCenter({ tasks, onSelectTask }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPermission(NotificationService.getPermission());
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const overdueTasks = tasks.filter((t) => isTaskOverdue(t));
  const dueTodayTasks = tasks.filter((t) => isTaskDueToday(t) && t.status !== "completed");
  const totalAlerts = overdueTasks.length + dueTodayTasks.length;

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setPermission(granted ? "granted" : "denied");
    if (granted) {
      toast.success("Device notifications enabled!");
    } else {
      toast.error("Notification permission denied or dismissed.");
    }
  };

  const handleSendTestNotification = () => {
    NotificationService.sendNotification(
      "TaskFlow Test Reminder 🎯",
      "Your mobile and browser notifications are fully operational! You will receive timely alerts for your tasks."
    );
    toast.success("Test notification dispatched with chime! 🔔");
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all border border-transparent hover:border-border focus:outline-none"
      >
        <Bell className="w-4 h-4" />
        {totalAlerts > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-card animate-pulse">
            {totalAlerts}
          </span>
        ) : (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-card border border-border shadow-2xl py-3 z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Task Notifications</span>
              {totalAlerts > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
                  {totalAlerts} Action Required
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Device Notification Activation Banner */}
          <div className="p-3.5 bg-muted/40 border-b border-border/60">
            {permission === "granted" ? (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Push Alerts Active</span>
                </div>
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Test Alert</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Enable Device Reminders
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Get real-time browser and mobile notifications for due deadlines.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full py-1.5 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Turn On Push Notifications</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification Items List */}
          <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
            {totalAlerts === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                <Check className="w-8 h-8 mx-auto text-emerald-500/80 mb-2" />
                <p className="font-semibold text-foreground">All caught up!</p>
                <p className="text-[11px]">No overdue tasks or immediate deadlines right now.</p>
              </div>
            ) : (
              <>
                {/* Overdue Items */}
                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setIsOpen(false);
                      onSelectTask?.(task);
                    }}
                    className="p-3.5 hover:bg-red-500/[0.04] transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 truncate">
                          Overdue: {task.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {task.due_date}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {task.category} • {task.priority.toUpperCase()} priority
                      </p>
                    </div>
                  </div>
                ))}

                {/* Due Today Items */}
                {dueTodayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setIsOpen(false);
                      onSelectTask?.(task);
                    }}
                    className="p-3.5 hover:bg-primary/[0.04] transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-foreground truncate">
                          Due Today: {task.title}
                        </p>
                        {task.due_time && (
                          <span className="text-[10px] text-amber-600 font-semibold shrink-0">
                            {task.due_time}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {task.category} • {task.priority.toUpperCase()} priority
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
