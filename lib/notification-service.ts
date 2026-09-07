import { Task } from "@/types";

export class NotificationService {
  private static isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  static getPermission(): NotificationPermission {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  }

  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        this.playChime();
        this.sendNotification(
          "Notifications Enabled! 🔔",
          "You will now receive timely task reminders and deadline alerts."
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Synthesize a pleasant chime using Web Audio API (zero external sound file needed)
  static playChime() {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Arpeggiated high tone (D5 to A5)
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // AudioContext might require user interaction on some mobile browsers
    }
  }

  static sendNotification(title: string, body: string, icon?: string) {
    if (!this.isSupported() || Notification.permission !== "granted") return;
    try {
      this.playChime();
      new Notification(title, {
        body,
        icon: icon || "https://api.dicebear.com/7.x/shapes/svg?seed=TaskFlow&backgroundColor=6366f1",
        badge: "https://api.dicebear.com/7.x/shapes/svg?seed=TaskFlow&backgroundColor=6366f1",
      });
    } catch (err) {
      console.warn("Notification dispatch failed:", err);
    }
  }

  // Scan user tasks and alert about upcoming or overdue deadlines
  static checkTaskReminders(tasks: Task[]) {
    if (!this.isSupported() || Notification.permission !== "granted") return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // Use sessionStorage to only notify once per session for each task
    const notifiedKey = "taskflow_notified_tasks";
    let notifiedSet = new Set<string>();
    try {
      const stored = sessionStorage.getItem(notifiedKey);
      if (stored) {
        notifiedSet = new Set(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    let newlyNotified = false;

    for (const task of tasks) {
      if (task.status === "completed" || !task.due_date) continue;
      if (notifiedSet.has(task.id)) continue;

      const [y, m, d] = task.due_date.split("-").map(Number);
      const dueDate = new Date(y, m - 1, d);

      if (dueDate < today) {
        // Overdue task alert
        this.sendNotification(
          `⚠️ Task Overdue: "${task.title}"`,
          `This ${task.priority.toUpperCase()} priority task was due on ${task.due_date}. Tap to review!`
        );
        notifiedSet.add(task.id);
        newlyNotified = true;
        break; // Show one at a time to avoid spamming
      } else if (task.due_date === todayStr) {
        // Due today alert
        const timeStr = task.due_time ? ` at ${task.due_time}` : "";
        this.sendNotification(
          `📅 Task Due Today: "${task.title}"`,
          `Scheduled for today${timeStr} (${task.category} • ${task.priority.toUpperCase()} priority).`
        );
        notifiedSet.add(task.id);
        newlyNotified = true;
        break;
      }
    }

    if (newlyNotified) {
      try {
        sessionStorage.setItem(notifiedKey, JSON.stringify(Array.from(notifiedSet)));
      } catch {
        // ignore
      }
    }
  }
}
