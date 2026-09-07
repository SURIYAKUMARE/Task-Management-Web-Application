"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-muted/60 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label="Toggle theme"
      title={`Current: ${theme || "system"}. Click to change`}
      className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200" />
      ) : theme === "light" ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />
      ) : (
        <Laptop className="w-4 h-4 text-slate-400 transition-transform duration-200" />
      )}
    </button>
  );
}
