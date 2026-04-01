"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { DeckCollection } from "@/lib/types";
import { DeckCard } from "@/components/deck-card";
import { BookOpen, Clock3, Sparkles, Trophy } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Trophy: <Trophy size={15} />,
  BookOpen: <BookOpen size={15} />,
  Sparkles: <Sparkles size={15} />,
};

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const accentMap: Record<string, { chip: string; glow: string }> = {
  cyan: { chip: "chip chip-cyan", glow: "collection-glow collection-glow-cyan" },
  emerald: {
    chip: "chip chip-emerald",
    glow: "collection-glow collection-glow-emerald",
  },
  violet: { chip: "chip chip-amber", glow: "collection-glow collection-glow-amber" },
};

interface CollectionSectionProps {
  collection: DeckCollection;
  totalDeckCount?: number;
}

export function CollectionSection({ collection, totalDeckCount }: CollectionSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const accent = accentMap[collection.accent] ?? accentMap.cyan;
  const visibleDeckCount = collection.decks.length;
  const resolvedTotalDeckCount = totalDeckCount ?? visibleDeckCount;
  const showFilteredCount = resolvedTotalDeckCount !== visibleDeckCount;

  return (
    <motion.section
      ref={ref}
      className="section-shell overflow-hidden p-5 sm:p-7 lg:p-8"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className={accent.glow} aria-hidden />

      <motion.div variants={fadeIn} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <span className={accent.chip}>
            {iconMap[collection.iconName]}
            {collection.label}
          </span>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[color:var(--text-strong)] sm:text-[1.95rem]">
            {collection.title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--text-base)] sm:text-[0.95rem]">
            {collection.description}
          </p>
        </div>

        <div className="min-w-[8.2rem] self-start rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--surface-2)] px-3 py-2 text-right sm:self-auto">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-[color:var(--text-muted)]">
            {showFilteredCount ? "Visible / total" : "Total decks"}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[color:var(--text-strong)]">
            {showFilteredCount ? `${visibleDeckCount} / ${resolvedTotalDeckCount}` : visibleDeckCount}
          </p>
        </div>
      </motion.div>

      {visibleDeckCount > 0 ? (
        <motion.div variants={sectionVariants} className="deck-grid mt-6 sm:mt-7">
          {collection.decks.map((deck, index) => (
            <DeckCard key={deck.id} deck={deck} accent={collection.accent} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeIn} className="empty-state mt-6 sm:mt-8">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] text-[color:var(--text-muted)]">
            <Clock3 size={19} />
          </div>
          <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">Additional decks in preparation</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--text-base)]">
            This section is reserved for independent and client-facing case studies. New presentations will be published here soon.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}

