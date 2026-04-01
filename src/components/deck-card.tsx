"use client";

import { motion } from "framer-motion";
import type { Deck } from "@/lib/types";
import { ExternalLink, FileText } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const accentChipMap: Record<string, string> = {
  cyan: "chip chip-cyan",
  emerald: "chip chip-emerald",
  violet: "chip chip-amber",
};

interface DeckCardProps {
  deck: Deck;
  accent: string;
  index: number;
}

export function DeckCard({ deck, accent, index }: DeckCardProps) {
  const accentChipClass = accentChipMap[accent] ?? "chip chip-cyan";

  return (
    <motion.article className="deck-card" variants={cardVariants} custom={index}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={accentChipClass}>{deck.badge}</span>
        <span className="chip border-[color:var(--line-soft)] bg-[color:var(--surface-2)] text-[color:var(--text-base)]">{deck.tag}</span>
      </div>

      <div className="space-y-2">
        <h3 className="deck-card-title">{deck.title}</h3>
        <p className="deck-card-summary">{deck.summary}</p>
      </div>

      <ul className="meta-list">
        {deck.meta.map((item) => (
          <li key={item.label} className="meta-item">
            <span className="meta-label">{item.label}</span>
            <span className="meta-value">{item.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        <a
          href={deck.primaryLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary min-w-[9rem] flex-1"
        >
          <FileText size={15} />
          {deck.primaryLink.label}
        </a>

        {deck.secondaryLink ? (
          <a
            href={deck.secondaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary min-w-[9rem] flex-1"
          >
            <ExternalLink size={15} />
            {deck.secondaryLink.label}
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

