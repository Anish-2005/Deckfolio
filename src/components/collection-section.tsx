"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { DeckCollection } from "@/lib/types";
import { DeckCard } from "@/components/deck-card";
import { Trophy, BookOpen, Sparkles, Clock } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy size={16} />,
    BookOpen: <BookOpen size={16} />,
    Sparkles: <Sparkles size={16} />,
};

const sectionVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

function getAccentStyles(accent: string) {
    switch (accent) {
        case "cyan":
            return {
                badgeBg: "rgba(6, 182, 212, 0.1)",
                badgeBorder: "rgba(6, 182, 212, 0.2)",
                badgeColor: "var(--accent-cyan)",
                glow: "radial-gradient(ellipse 60% 40% at 20% 40%, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
            };
        case "emerald":
            return {
                badgeBg: "rgba(16, 185, 129, 0.1)",
                badgeBorder: "rgba(16, 185, 129, 0.2)",
                badgeColor: "var(--accent-emerald)",
                glow: "radial-gradient(ellipse 60% 40% at 80% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
            };
        default:
            return {
                badgeBg: "rgba(139, 92, 246, 0.1)",
                badgeBorder: "rgba(139, 92, 246, 0.2)",
                badgeColor: "var(--accent-violet)",
                glow: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            };
    }
}

interface CollectionSectionProps {
    collection: DeckCollection;
}

export function CollectionSection({ collection }: CollectionSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const styles = getAccentStyles(collection.accent);

    return (
        <motion.section
            ref={ref}
            className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-10"
            style={{
                background: "var(--surface-base)",
                borderColor: "var(--border-color)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                boxShadow: "var(--shadow-section)",
            }}
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Background Glow */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: styles.glow }}
                aria-hidden
            />

            {/* Header */}
            <motion.div variants={fadeIn} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
                        style={{
                            background: styles.badgeBg,
                            border: `1px solid ${styles.badgeBorder}`,
                            color: styles.badgeColor,
                        }}
                    >
                        {iconMap[collection.iconName]}
                        {collection.label}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <h2
                        className="text-2xl font-bold sm:text-3xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {collection.title}
                    </h2>
                    <p
                        className="max-w-2xl text-sm leading-relaxed sm:text-base"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {collection.description}
                    </p>
                </div>
            </motion.div>

            {/* Decks Grid */}
            {collection.decks.length > 0 ? (
                <motion.div
                    className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2"
                    variants={sectionVariants}
                >
                    {collection.decks.map((deck, index) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            accent={collection.accent}
                            index={index}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    variants={fadeIn}
                    className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center sm:mt-10"
                    style={{
                        borderColor: "var(--border-color)",
                        background: "var(--surface-muted)",
                    }}
                >
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ background: "var(--badge-bg)" }}
                    >
                        <Clock
                            size={22}
                            style={{ color: "var(--text-muted)" }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3
                            className="text-lg font-bold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Curating flagship decks
                        </h3>
                        <p
                            className="max-w-md text-sm"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Startup pitch decks, proof-of-concept walkthroughs, and client
                            innovation reviews will be added here shortly.
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.section>
    );
}
