"use client";

import { motion } from "framer-motion";
import { heroStats, focusAreasList } from "@/lib/data";
import { ArrowDown, Sparkles } from "lucide-react";

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

export function Hero() {
    return (
        <section className="relative flex min-h-[85vh] items-center pt-24 pb-8 sm:pt-28">
            {/* Ambient orbs */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
                <div className="animate-float absolute -left-32 top-10 h-[400px] w-[400px] rounded-full bg-[color:var(--glow-1)] blur-[160px]" />
                <div className="animate-float-slow absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-[color:var(--glow-2)] blur-[140px]" />
                <div className="animate-float-slower absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[color:var(--glow-3)] blur-[120px]" />
            </div>

            {/* Grid pattern */}
            <div className="ambient-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />

            <div className="page-container">
                <motion.div
                    className="flex flex-col gap-8 lg:gap-10"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Eyebrow */}
                    <motion.div variants={fadeUp} className="flex items-center gap-2">
                        <span className="badge badge-cyan">
                            <Sparkles size={12} />
                            Presentation Showcase
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-5">
                        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">
                            Smart India Hackathon finalist decks{" "}
                            <span className="gradient-text">
                                + internal innovations
                            </span>
                            , in one recruiter-ready lane.
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--text-secondary)] sm:text-xl">
                            Each deck links directly to the slide file decision-makers need to see first.
                            Clean naming, quick context, and portfolio polish for juries, recruiters,
                            and faculty reviews.
                        </p>
                    </motion.div>

                    {/* CTA row */}
                    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                        <a href="#collections" className="btn-primary">
                            <ArrowDown size={16} />
                            Browse All Decks
                        </a>
                        <a href="mailto:anish@example.com?subject=Deckfolio%20Inquiry" className="btn-secondary">
                            Request Case Study
                        </a>
                    </motion.div>

                    {/* Stats bar */}
                    <motion.div
                        variants={fadeUp}
                        className="glass-panel mt-4 grid gap-6 rounded-2xl p-6 sm:grid-cols-3 lg:gap-10"
                    >
                        {heroStats.map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-1">
                                <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                                    {stat.label}
                                </span>
                                <span className="stat-value text-3xl font-bold text-[color:var(--text-primary)]">
                                    {stat.value}
                                    {stat.suffix && (
                                        <span className="ml-1 text-lg font-medium text-[color:var(--text-muted)]">
                                            {stat.suffix}
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Focus areas tags */}
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-wrap items-center gap-2 text-sm"
                    >
                        <span className="text-[color:var(--text-muted)]">Focus areas:</span>
                        {focusAreasList.map((area) => (
                            <span key={area} className="badge">
                                {area}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
