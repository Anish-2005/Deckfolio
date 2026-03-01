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
        <section className="relative flex min-h-[85vh] items-center pb-8 pt-24 sm:pt-28">
            {/* Ambient orbs */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                aria-hidden
            >
                <div
                    className="animate-float absolute -left-32 top-10"
                    style={{
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "var(--glow-1)",
                        filter: "blur(160px)",
                    }}
                />
                <div
                    className="animate-float-slow absolute right-0 top-1/3"
                    style={{
                        width: 350,
                        height: 350,
                        borderRadius: "50%",
                        background: "var(--glow-2)",
                        filter: "blur(140px)",
                    }}
                />
                <div
                    className="animate-float-slower absolute bottom-0 left-1/3"
                    style={{
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "var(--glow-3)",
                        filter: "blur(120px)",
                    }}
                />
            </div>

            {/* Grid pattern */}
            <div
                className="ambient-grid pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            />

            <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
                <motion.div
                    className="flex flex-col gap-8 lg:gap-10"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Eyebrow */}
                    <motion.div variants={fadeUp} className="flex items-center gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
                            style={{
                                background: "rgba(6, 182, 212, 0.1)",
                                border: "1px solid rgba(6, 182, 212, 0.2)",
                                color: "var(--accent-cyan)",
                            }}
                        >
                            <Sparkles size={12} />
                            Presentation Showcase
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-5">
                        <h1
                            className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Smart India Hackathon finalist decks{" "}
                            <span
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                + internal innovations
                            </span>
                            , in one recruiter-ready lane.
                        </h1>
                        <p
                            className="max-w-2xl text-lg leading-relaxed sm:text-xl"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Each deck links directly to the slide file decision-makers need
                            to see first. Clean naming, quick context, and portfolio polish
                            for juries, recruiters, and faculty reviews.
                        </p>
                    </motion.div>

                    {/* CTA row */}
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-wrap items-center gap-3"
                    >
                        <a
                            href="#collections"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))",
                                color: "#041b16",
                                boxShadow: "0 2px 16px rgba(6, 182, 212, 0.3)",
                            }}
                        >
                            <ArrowDown size={16} />
                            Browse All Decks
                        </a>
                        <a
                            href="mailto:anish@example.com?subject=Deckfolio%20Inquiry"
                            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                            style={{
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                            }}
                        >
                            Request Case Study
                        </a>
                    </motion.div>

                    {/* Stats bar */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-4 grid gap-6 rounded-2xl border p-6 sm:grid-cols-3 lg:gap-10"
                        style={{
                            background: "var(--surface-base)",
                            borderColor: "var(--border-color)",
                            backdropFilter: "blur(24px) saturate(1.4)",
                            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                        }}
                    >
                        {heroStats.map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-1">
                                <span
                                    className="text-[0.65rem] font-medium uppercase tracking-[0.2em]"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {stat.label}
                                </span>
                                <span
                                    className="text-3xl font-bold tabular-nums"
                                    style={{
                                        color: "var(--text-primary)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {stat.value}
                                    {stat.suffix && (
                                        <span
                                            className="ml-1 text-lg font-medium"
                                            style={{ color: "var(--text-muted)" }}
                                        >
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
                        <span style={{ color: "var(--text-muted)" }}>Focus areas:</span>
                        {focusAreasList.map((area) => (
                            <span
                                key={area}
                                className="inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
                                style={{
                                    background: "var(--badge-bg)",
                                    border: "1px solid var(--badge-border)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                {area}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
