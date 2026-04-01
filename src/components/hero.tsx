"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { focusAreasList, heroStats } from "@/lib/data";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const proofItems = [
  {
    title: "Decision-ready context",
    body: "Every card captures what problem was solved, which stack was used, and where to view the deck instantly.",
    icon: ShieldCheck,
  },
  {
    title: "Recruiter-first navigation",
    body: "Collections are structured by relevance so review panels and hiring teams can find work samples without friction.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Fast review cadence",
    body: "Metadata, links, and visual hierarchy are tuned for short-listing in under two minutes.",
    icon: TimerReset,
  },
];

export function Hero() {
  return (
    <section id="top" className="relative pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pt-36">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="page-container">
        <motion.div
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="surface-panel flex flex-col gap-6 p-6 sm:p-8">
            <motion.span variants={fadeUp} className="kicker w-fit">
              <Sparkles size={13} />
              SIH + Internal Innovation Decks
            </motion.span>

            <motion.div variants={fadeUp} className="space-y-4">
              <h1 className="section-title max-w-3xl">
                Professional pitch decks curated for <span className="brand-gradient-text">juries, recruiters, and mentors</span>.
              </h1>
              <p className="section-description max-w-2xl">
                Deckfolio presents Smart India Hackathon finalist work and supporting internal builds in a single polished showcase with direct links to every document.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <a href="#collections" className="btn btn-primary">
                Explore Collections
                <ArrowRight size={15} />
              </a>
              <a href="mailto:anish@example.com?subject=Deckfolio%20Case%20Study" className="btn btn-secondary">
                Request Case Study
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="stat-grid">
              {heroStats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="ml-1 text-base font-semibold text-[color:var(--text-muted)]">{stat.suffix}</span>
                    ) : null}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              {focusAreasList.map((area) => (
                <span key={area} className="focus-tag">
                  {area}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.aside variants={fadeUp} className="hero-proof">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Why this layout works</p>
              <span className="chip chip-cyan">Portfolio UX</span>
            </div>

            <div className="hero-proof-list">
              {proofItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="hero-proof-item">
                    <div className="flex items-center gap-2 text-[color:var(--text-strong)]">
                      <Icon size={15} />
                      <h3 className="hero-proof-title">{item.title}</h3>
                    </div>
                    <p>{item.body}</p>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}

