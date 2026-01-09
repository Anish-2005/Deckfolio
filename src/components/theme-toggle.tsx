"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-muted)] px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--text-muted)]"
        aria-label="Theme toggle loading"
        aria-disabled
      >
        ...
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex items-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-muted)] transition hover:border-[color:var(--text-primary)]"
    >
      <span className="text-[color:var(--text-primary)]">{isDark ? "Light" : "Dark"}</span>
      <span className="text-[color:var(--text-muted)]">Mode</span>
    </button>
  );
}
