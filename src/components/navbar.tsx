"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, ArrowDown } from "lucide-react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 100], [0.72, 0.95]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <motion.nav
            className="fixed left-0 right-0 top-0 z-50"
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
            <motion.div
                className="border-b transition-all duration-500"
                style={{
                    backgroundColor: "var(--nav-bg)",
                    borderColor: scrolled ? "var(--border-color)" : "transparent",
                    backdropFilter: "blur(20px) saturate(1.6)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.6)",
                    boxShadow: scrolled
                        ? "0 2px 24px rgba(0,0,0,0.06)"
                        : "none",
                }}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
                    {/* Logo */}
                    <a
                        href="#"
                        className="flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        <Image
                            src="/deckfolio.png"
                            width={36}
                            height={36}
                            alt="Deckfolio logo"
                            priority
                            className="rounded-lg"
                            style={{
                                filter: "drop-shadow(0 4px 12px rgba(6,182,212,0.2))",
                            }}
                        />
                        <div className="flex flex-col">
                            <span
                                className="text-sm font-bold tracking-wide"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Deckfolio
                            </span>
                            <span
                                className="hidden text-[0.6rem] uppercase tracking-[0.2em] sm:block"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Presentation Showcase
                            </span>
                        </div>
                    </a>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />
                        <a
                            href="#collections"
                            className="hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-px sm:inline-flex"
                            style={{
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                                background: "transparent",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-strong)";
                                e.currentTarget.style.background = "var(--surface-muted)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-color)";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <FileText size={15} />
                            <span>Decks</span>
                        </a>
                        <a
                            href="#collections"
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                            style={{
                                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))",
                                color: "#041b16",
                                boxShadow: "0 2px 12px rgba(6, 182, 212, 0.25)",
                            }}
                        >
                            <ArrowDown size={15} />
                            <span>Explore</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    );
}
