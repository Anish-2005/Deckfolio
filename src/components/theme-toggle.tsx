"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * Triggers a circular-reveal View Transition from the click point.
 * Falls back to an instant swap when the API isn't available.
 */
function triggerCircularReveal(
  event: React.MouseEvent<HTMLButtonElement>,
  callback: () => void,
) {
  // Fallback for browsers without View Transitions API
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    callback();
    return;
  }

  // Get click coordinates for the circle origin
  const x = event.clientX;
  const y = event.clientY;

  // Calculate the maximum radius needed to cover the entire viewport
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  // Start the view transition
  const transition = document.startViewTransition(() => {
    callback();
  });

  // Animate the new view with a circular clip-path reveal
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
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
      triggerCircularReveal(e, () => setTheme(nextTheme));
    },
    [resolvedTheme, setTheme],
  );

  if (!mounted || !resolvedTheme) {
    return (
      <div className="h-10 w-10 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-muted)]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-muted)] text-[color:var(--text-primary)] transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-card)]"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
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
