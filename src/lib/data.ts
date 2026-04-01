import type { DeckCollection, HeroStat } from "./types";

export const deckCollections: DeckCollection[] = [
  {
    id: "sih",
    label: "National Finalist Track",
    title: "Smart India Hackathon Finalist Decks",
    description:
      "Jury-facing finalist presentations built for policy, implementation feasibility, and measurable outcomes.",
    accent: "cyan",
    iconName: "Trophy",
    decks: [
      {
        id: "sih-lawai",
        title: "LawAI: AI-Powered Legal Assistant",
        summary:
          "Smart India Hackathon 2024 finalist solution designed to improve access to legal guidance through assisted FIR workflows, conversational support, and secure document handling.",
        badge: "SIH Finalist",
        tag: "AI + LegalTech | 2024",
        meta: [
          {
            label: "Impact",
            value: "Expands legal support access for large-scale public use",
          },
          {
            label: "Highlights",
            value: "Guided FIR builder, AI legal assistant, searchable legal knowledge",
          },
          {
            label: "Tech Stack",
            value: "React Native, Expo, AI/ML",
          },
        ],
        primaryLink: { href: "/decks/sih-lawai.pdf", label: "View Deck" },
        secondaryLink: {
          href: "https://github.com/Anish-2005/LawAI-PrivacyV",
          label: "View on GitHub",
        },
      },
      {
        id: "sih-nyantra",
        title: "Nyantra: DBT Social Assistance Platform",
        summary:
          "Smart India Hackathon 2025 finalist platform focused on improving Direct Benefit Transfer operations with ML-assisted workflow support and transparent disbursement visibility.",
        badge: "SIH Finalist",
        tag: "Gov Welfare | 2025",
        meta: [
          {
            label: "Mission",
            value: "Improve delivery quality for DBT welfare schemes",
          },
          {
            label: "Status",
            value: "Advanced to SIH 2025 national finals",
          },
          {
            label: "Tech Stack",
            value: "Next.js, TypeScript, ML",
          },
        ],
        primaryLink: { href: "/decks/sih-nyantra.pdf", label: "View Deck" },
        secondaryLink: {
          href: "https://github.com/Anish-2005/Nyantra",
          label: "Project Overview",
        },
      },
    ],
  },
  {
    id: "internal",
    label: "Internal and Academic",
    title: "Pre-Final Internal Project Decks",
    description:
      "Institutional iterations and mentor-review decks that informed final SIH submissions.",
    accent: "emerald",
    iconName: "BookOpen",
    decks: [
      {
        id: "internal-vanmitra",
        title: "VanMitra: Forest Rights Atlas and DSS",
        summary:
          "Internal SIH 2025 concept combining geospatial rights mapping, OCR-assisted claims, and decision-support analytics.",
        badge: "Internal SIH",
        tag: "ForestTech | 2025",
        meta: [
          {
            label: "Use Case",
            value: "Forest rights mapping and claim support for FRA communities",
          },
          {
            label: "Highlights",
            value: "Atlas workflows, OCR claim extraction, operational dashboards",
          },
          {
            label: "Tech Stack",
            value: "Next.js, MapLibre, Framer Motion",
          },
        ],
        primaryLink: {
          href: "/decks/internal-vanmitra.pdf",
          label: "View Deck",
        },
        secondaryLink: {
          href: "https://github.com/Anish-2005/VanMitra",
          label: "View on GitHub",
        },
      },
      {
        id: "internal-chatbot-ticketing",
        title: "Museum Concierge: Chatbot Ticketing System",
        summary:
          "Internal SIH 2024 build using conversational AI to automate booking, visitor guidance, and queue insights for museum operations.",
        badge: "Internal SIH",
        tag: "Museums | 2024",
        meta: [
          {
            label: "Use Case",
            value: "Automated ticketing and guided visit support",
          },
          {
            label: "Highlights",
            value: "Visitor Q&A, guided routes, operations analytics",
          },
          {
            label: "Tech Stack",
            value: "React, FastAPI, MongoDB",
          },
        ],
        primaryLink: {
          href: "/decks/internal-chatbot-ticketing.pdf",
          label: "View Deck",
        },
        secondaryLink: {
          href: "https://github.com/Anish-2005/Online-Chatbot-Based-Ticketing-System",
          label: "Project Overview",
        },
      },
    ],
  },
  {
    id: "non-sih",
    label: "Selected Work",
    title: "Non-SIH Presentation Decks",
    description:
      "Reserved for startup, client, and independent innovation decks outside the SIH pipeline.",
    accent: "violet",
    iconName: "Sparkles",
    decks: [],
    comingSoon: true,
  },
];

export const totalDecks = deckCollections.reduce(
  (count, collection) => count + collection.decks.length,
  0,
);

export const heroStats: HeroStat[] = [
  { label: "Total Decks", value: totalDecks.toString(), suffix: "+" },
  { label: "Focus Areas", value: "3", suffix: " Domains" },
  { label: "Finalist Wins", value: "2", suffix: " SIH" },
];

export const focusAreasList = ["LegalTech", "Welfare and GovTech", "ForestTech"];

