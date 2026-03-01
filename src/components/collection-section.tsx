"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { DeckCollection } from "@/lib/types";
import { DeckCard } from "@/components/deck-card";
import { Trophy, BookOpen, Sparkles, Clock } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy size={18} />,
    BookOpen: <BookOpen size={18} />,
    Sparkles: <Sparkles size={18} />,
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

interface CollectionSectionProps {
    collection: DeckCollection;
}

export function CollectionSection({ collection }: CollectionSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const badgeClass =
        collection.accent === "cyan"
            ? "badge-cyan"
            : collection.accent === "emerald"
                ? "badge-emerald"
                : "badge-violet";

    return (
        <motion.section
            ref={ref}
            className={`glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10`}
            style={{ boxShadow: "var(--shadow-section)" }}
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Background Glow */}
            <div
                className={`pointer-events-none absolute inset-0 -z-10 section-glow-${collection.accent}`}
                aria-hidden
            />

            {/* Header */}
            <motion.div variants={fadeIn} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className={`badge ${badgeClass}`}>
                        {iconMap[collection.iconName]}
                        {collection.label}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[color:var(--text-primary)] sm:text-3xl">
                        {collection.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-secondary)] sm:text-base">
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
                    className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[color:var(--border-color)] bg-[color:var(--surface-muted)] p-10 text-center sm:mt-10"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--badge-bg)]">
                        <Clock size={22} className="text-[color:var(--text-muted)]" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-[color:var(--text-primary)]">
                            Curating flagship decks
                        </h3>
                        <p className="max-w-md text-sm text-[color:var(--text-secondary)]">
                            Startup pitch decks, proof-of-concept walkthroughs, and client
                            innovation reviews will be added here shortly.
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.section>
    );
}
