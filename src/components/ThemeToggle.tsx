"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 border rounded-md text-sm cursor-pointer transition-colors"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        color: "var(--muted)",
      }}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
