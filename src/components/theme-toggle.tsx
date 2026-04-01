"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

function triggerCircularReveal(
  event: React.MouseEvent<HTMLButtonElement>,
  callback: () => void,
) {
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    callback();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    callback();
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
      triggerCircularReveal(event, () => setTheme(nextTheme));
    },
    [resolvedTheme, setTheme],
  );

  if (!resolvedTheme) {
    return (
      <div className="h-10 w-10 rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--surface-2)]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--surface-2)] text-[color:var(--text-strong)] transition-colors hover:border-[color:var(--line-strong)] hover:bg-[color:var(--surface-1)]"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: -12, opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 12, opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="absolute"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
