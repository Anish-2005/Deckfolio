"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowDownRight, FileText } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50"
      initial={{ y: -84, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
        <div className="page-container flex items-center justify-between py-3">
          <a href="#top" className="flex items-center gap-3">
            <Image
              src="/deckfolio.png"
              width={36}
              height={36}
              alt="Deckfolio logo"
              priority
              className="rounded-lg"
            />
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--text-strong)]">
                Deckfolio
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                Presentation Archive
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#collections" className="nav-link">
              Collections
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a href="#collections" className="btn btn-secondary hidden sm:inline-flex">
              <FileText size={15} />
              Browse Decks
            </a>
            <a href="#collections" className="btn btn-primary sm:hidden" aria-label="Browse decks">
              <ArrowDownRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

