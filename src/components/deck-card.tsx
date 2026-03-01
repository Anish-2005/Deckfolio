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
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

interface DeckCardProps {
    deck: Deck;
    accent: string;
    index: number;
}

function getAccentColors(accent: string) {
    switch (accent) {
        case "cyan":
            return {
                badgeBg: "rgba(6, 182, 212, 0.1)",
                badgeBorder: "rgba(6, 182, 212, 0.2)",
                badgeColor: "var(--accent-cyan)",
            };
        case "emerald":
            return {
                badgeBg: "rgba(16, 185, 129, 0.1)",
                badgeBorder: "rgba(16, 185, 129, 0.2)",
                badgeColor: "var(--accent-emerald)",
            };
        default:
            return {
                badgeBg: "rgba(139, 92, 246, 0.1)",
                badgeBorder: "rgba(139, 92, 246, 0.2)",
                badgeColor: "var(--accent-violet)",
            };
    }
}

export function DeckCard({ deck, accent, index }: DeckCardProps) {
    const colors = getAccentColors(accent);

    return (
        <motion.article
            variants={cardVariants}
            className="group relative flex flex-col gap-5 rounded-2xl border p-6 transition-all duration-400 sm:p-7"
            style={{
                background: "var(--surface-card)",
                borderColor: "var(--border-color)",
                backdropFilter: "blur(16px) saturate(1.2)",
                WebkitBackdropFilter: "blur(16px) saturate(1.2)",
                boxShadow: "var(--shadow-card)",
            }}
            whileHover={{
                y: -3,
                boxShadow: "var(--shadow-card-hover)",
                borderColor: "var(--border-strong)",
            }}
        >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
                <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
                    style={{
                        background: colors.badgeBg,
                        border: `1px solid ${colors.badgeBorder}`,
                        color: colors.badgeColor,
                    }}
                >
                    {deck.badge}
                </span>
                <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.06em]"
                    style={{
                        background: "var(--badge-bg)",
                        border: "1px solid var(--badge-border)",
                        color: "var(--text-secondary)",
                    }}
                >
                    {deck.tag}
                </span>
            </div>

            {/* Title + Summary */}
            <div className="flex flex-col gap-3">
                <h3
                    className="text-xl font-bold leading-snug sm:text-2xl"
                    style={{ color: "var(--text-primary)" }}
                >
                    {deck.title}
                </h3>
                <p
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {deck.summary}
                </p>
            </div>

            {/* Meta */}
            <ul className="flex flex-col gap-3">
                {deck.meta.map((item) => (
                    <li key={item.label} className="relative pl-4">
                        {/* Accent bar */}
                        <span
                            className="absolute left-0 top-1 h-4 w-[3px] rounded-full"
                            style={{
                                background: `linear-gradient(to bottom, var(--accent-cyan), var(--accent-emerald))`,
                                opacity: 0.5,
                            }}
                        />
                        <span
                            className="block text-[0.6rem] font-semibold uppercase tracking-[0.18em]"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {item.label}
                        </span>
                        <span
                            className="text-sm"
                            style={{ color: "var(--text-primary)" }}
                        >
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
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))",
                        color: "#041b16",
                        boxShadow: "0 2px 12px rgba(6, 182, 212, 0.25)",
                    }}
                >
                    <FileText size={15} />
                    {deck.primaryLink.label}
                </a>
                {deck.secondaryLink && (
                    <a
                        href={deck.secondaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                        style={{
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                    >
                        <ExternalLink size={15} />
                        {deck.secondaryLink.label}
                    </a>
                )}
            </div>
        </motion.article>
    );
}
