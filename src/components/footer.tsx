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
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
            className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12"
            style={{ boxShadow: "var(--shadow-section)" }}
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
                <motion.div variants={fadeIn} className="flex flex-col gap-6 lg:max-w-lg">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/deckfolio.png"
                            width={36}
                            height={36}
                            alt="Deckfolio badge"
                            className="rounded-lg"
                        />
                        <span className="text-sm font-bold tracking-wide text-[color:var(--text-primary)]">
                            Deckfolio
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold leading-snug text-[color:var(--text-primary)] sm:text-3xl">
                        Future-ready presentations
                        <span className="gradient-text-warm"> live here.</span>
                    </h2>

                    <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">
                        Extend Deckfolio with Proof-of-Concepts, Startup Pitch Decks, or
                        Research Posters. Duplicate any card, swap the metadata, and point the
                        button to your PPT or PDF.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <a
                            href="mailto:anish@example.com?subject=Deckfolio%20Collaboration"
                            className="btn-primary"
                        >
                            <Mail size={15} />
                            Collaborate
                        </a>
                        <button
                            onClick={scrollToTop}
                            className="btn-secondary"
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
                    className="flex flex-col gap-5 text-sm text-[color:var(--text-secondary)]"
                >
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                        Connect
                    </span>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://github.com/Anish-2005"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="animated-link inline-flex items-center gap-2 transition-colors hover:text-[color:var(--text-primary)]"
                        >
                            <Github size={15} />
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="animated-link inline-flex items-center gap-2 transition-colors hover:text-[color:var(--text-primary)]"
                        >
                            <Linkedin size={15} />
                            LinkedIn
                        </a>
                        <a
                            href="mailto:anish@example.com"
                            className="animated-link inline-flex items-center gap-2 transition-colors hover:text-[color:var(--text-primary)]"
                        >
                            <Mail size={15} />
                            Email
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Divider + copyright */}
            <motion.div
                variants={fadeIn}
                className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--border-color)] pt-6 sm:flex-row"
            >
                <p className="text-xs text-[color:var(--text-muted)]">
                    © {new Date().getFullYear()} Deckfolio. Crafted with precision.
                </p>
                <p className="text-xs text-[color:var(--text-muted)]">
                    Built with Next.js · Framer Motion · Tailwind CSS
                </p>
            </motion.div>
        </motion.footer>
    );
}
