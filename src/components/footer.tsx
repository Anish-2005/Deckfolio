"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Mail, ArrowUp, Github, Linkedin } from "lucide-react";

const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const container = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

export function Footer() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.footer
            ref={ref}
            className="relative overflow-hidden rounded-3xl border p-8 sm:p-10 lg:p-12"
            style={{
                background: "var(--surface-base)",
                borderColor: "var(--border-color)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                boxShadow: "var(--shadow-section)",
            }}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Background accent */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 40% at 80% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 70%)",
                }}
                aria-hidden
            />

            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                {/* Left column */}
                <motion.div
                    variants={fadeIn}
                    className="flex flex-col gap-6 lg:max-w-lg"
                >
                    <div className="flex items-center gap-3">
                        <Image
                            src="/deckfolio.png"
                            width={36}
                            height={36}
                            alt="Deckfolio badge"
                            className="rounded-lg"
                        />
                        <span
                            className="text-sm font-bold tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Deckfolio
                        </span>
                    </div>

                    <h2
                        className="text-2xl font-bold leading-snug sm:text-3xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Future-ready presentations
                        <span
                            style={{
                                backgroundImage:
                                    "linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {" "}
                            live here.
                        </span>
                    </h2>

                    <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Extend Deckfolio with Proof-of-Concepts, Startup Pitch Decks, or
                        Research Posters. Duplicate any card, swap the metadata, and
                        point the button to your PPT or PDF.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <a
                            href="mailto:anish@example.com?subject=Deckfolio%20Collaboration"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))",
                                color: "#041b16",
                                boxShadow: "0 2px 12px rgba(6, 182, 212, 0.25)",
                            }}
                        >
                            <Mail size={15} />
                            Collaborate
                        </a>
                        <button
                            onClick={scrollToTop}
                            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                            style={{
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                                background: "transparent",
                                cursor: "pointer",
                            }}
                            aria-label="Back to top"
                        >
                            <ArrowUp size={15} />
                            Back to Top
                        </button>
                    </div>
                </motion.div>

                {/* Right column – links */}
                <motion.div
                    variants={fadeIn}
                    className="flex flex-col gap-5 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <span
                        className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Connect
                    </span>
                    <div className="flex flex-col gap-3">
                        {[
                            {
                                href: "https://github.com/Anish-2005",
                                icon: <Github size={15} />,
                                label: "GitHub",
                            },
                            {
                                href: "https://linkedin.com",
                                icon: <Linkedin size={15} />,
                                label: "LinkedIn",
                            },
                            {
                                href: "mailto:anish@example.com",
                                icon: <Mail size={15} />,
                                label: "Email",
                            },
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="animated-link inline-flex items-center gap-2 transition-colors"
                                style={{ color: "var(--text-secondary)" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Divider + copyright */}
            <motion.div
                variants={fadeIn}
                className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
                style={{ borderColor: "var(--border-color)" }}
            >
                <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                >
                    © {new Date().getFullYear()} Deckfolio. Crafted with precision.
                </p>
                <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                >
                    Built with Next.js · Framer Motion · Tailwind CSS
                </p>
            </motion.div>
        </motion.footer>
    );
}
