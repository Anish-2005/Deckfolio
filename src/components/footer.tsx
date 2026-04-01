"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const quickLinks = [
  { label: "Hero", href: "#top" },
  { label: "Collections", href: "#collections" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Anish-2005", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Email", href: "mailto:anish@example.com", icon: Mail },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-70px" });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      id="contact"
      ref={ref}
      className="section-shell overflow-hidden p-6 sm:p-8"
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="collection-glow collection-glow-cyan" aria-hidden />

      <div className="footer-columns">
        <motion.section variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/deckfolio.png"
              width={38}
              height={38}
              alt="Deckfolio mark"
              className="rounded-xl"
            />
            <div>
              <p className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--text-strong)]">Deckfolio</p>
              <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Presentation Portfolio</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--text-strong)] sm:text-[2rem]">
            Keep the portfolio review flow <span className="brand-gradient-text">clear, concise, and fast</span>.
          </h2>

          <p className="max-w-xl text-sm leading-7 text-[color:var(--text-base)] sm:text-[0.94rem]">
            Add decks, update metadata, and keep this repository as your single source of truth for mentor, jury, and recruiter walkthroughs.
          </p>

          <a href="mailto:anish@example.com?subject=Deckfolio%20Collaboration" className="btn btn-primary">
            <Mail size={15} />
            Collaborate
          </a>
        </motion.section>

        <motion.section variants={fadeIn} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Quick links</p>
          <div className="flex flex-col gap-2.5 text-sm text-[color:var(--text-base)]">
            {quickLinks.map((link) => (
              <a key={link.label} href={link.href} className="link-underline hover:text-[color:var(--text-strong)]">
                {link.label}
              </a>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeIn} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Connect</p>

          <div className="flex flex-col gap-2.5 text-sm text-[color:var(--text-base)]">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-2 hover:text-[color:var(--text-strong)]"
                >
                  <Icon size={15} />
                  {item.label}
                </a>
              );
            })}
          </div>

          <button type="button" onClick={scrollToTop} className="btn btn-secondary mt-2">
            Back to top
            <ArrowUpRight size={15} />
          </button>
        </motion.section>
      </div>

      <motion.div variants={fadeIn} className="soft-divider mt-8 pt-5 text-xs text-[color:var(--text-muted)] sm:flex sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Deckfolio. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Built with Next.js, Framer Motion, and Tailwind CSS.</p>
      </motion.div>
    </motion.footer>
  );
}

