"use client";

import { motion } from "framer-motion";
import type { Deck } from "@/lib/types";
import { ExternalLink, FileText } from "lucide-react";

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

interface DeckCardProps {
    deck: Deck;
    accent: string;
    index: number;
}

export function DeckCard({ deck, accent, index }: DeckCardProps) {
    const badgeClass =
        accent === "cyan"
            ? "badge-cyan"
            : accent === "emerald"
                ? "badge-emerald"
                : "badge-violet";

    return (
        <motion.article
            variants={cardVariants}
            className="glass-card group relative flex flex-col gap-5 rounded-2xl p-6 sm:p-7"
        >
            {/* Hover glow overlay */}
            <div
                className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 section-glow-${accent}`}
                aria-hidden
            />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
                <span className={`badge ${badgeClass}`}>
                    {deck.badge}
                </span>
                <span className="badge">
                    {deck.tag}
                </span>
            </div>

            {/* Title + Summary */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold leading-snug text-[color:var(--text-primary)] sm:text-2xl">
                    {deck.title}
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--text-secondary)] sm:text-base">
                    {deck.summary}
                </p>
            </div>

            {/* Meta */}
            <ul className="flex flex-col gap-3">
                {deck.meta.map((item) => (
                    <li key={item.label} className="meta-item">
                        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                            {item.label}
                        </span>
                        <span className="text-sm text-[color:var(--text-primary)]">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <a
                    href={deck.primaryLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1"
                >
                    <FileText size={15} />
                    {deck.primaryLink.label}
                </a>
                {deck.secondaryLink && (
                    <a
                        href={deck.secondaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1"
                    >
                        <ExternalLink size={15} />
                        {deck.secondaryLink.label}
                    </a>
                )}
            </div>
        </motion.article>
    );
}
