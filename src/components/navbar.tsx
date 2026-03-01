"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, ArrowDown } from "lucide-react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const navOpacity = useTransform(scrollY, [0, 100], [0.72, 0.95]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <motion.nav
            className={`nav-glass fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled
                    ? "shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
                    : "shadow-none"
                }`}
            style={{ opacity: navOpacity }}
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="page-container flex items-center justify-between py-3">
                {/* Logo */}
                <a
                    href="#"
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                    <Image
                        src="/deckfolio.png"
                        width={40}
                        height={40}
                        alt="Deckfolio logo"
                        priority
                        className="rounded-lg drop-shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-wide text-[color:var(--text-primary)]">
                            Deckfolio
                        </span>
                        <span className="hidden text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--text-muted)] sm:block">
                            Presentation Showcase
                        </span>
                    </div>
                </a>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <a
                        href="#collections"
                        className="btn-secondary hidden sm:inline-flex"
                    >
                        <FileText size={15} />
                        <span>Decks</span>
                    </a>
                    <a
                        href="#collections"
                        className="btn-primary"
                    >
                        <ArrowDown size={15} />
                        <span>Explore</span>
                    </a>
                </div>
            </div>
        </motion.nav>
    );
}
