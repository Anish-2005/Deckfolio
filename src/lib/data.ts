import type { DeckCollection, HeroStat } from "./types";

export const deckCollections: DeckCollection[] = [
  {
    id: "sih",
    label: "National Finalist Portfolio",
    title: "Smart India Hackathon Finalist Decks",
    description:
      "Finalist presentations prepared for ministry and jury reviews with clear problem framing, architecture direction, and execution readiness.",
    accent: "cyan",
    iconName: "Trophy",
    decks: [
      {
        id: "sih-lawai",
        title: "LawAI: AI-Powered Legal Assistant",
        summary:
          "SIH 2024 finalist concept focused on improving legal access through guided FIR drafting, conversational legal support, and secure case-document handling.",
        badge: "SIH Finalist",
        tag: "AI + LegalTech - 2024",
        focusArea: "LegalTech",
        year: 2024,
        meta: [
          {
            label: "Impact",
            value: "Improves access to legal guidance at public scale",
          },
          {
            label: "Highlights",
            value: "Guided FIR workflow, AI legal support, searchable legal reference",
          },
          {
            label: "Tech Stack",
            value: "React Native, Expo, AI/ML",
          },
        ],
        primaryLink: { href: "/decks/sih-lawai.pdf", label: "Open Deck" },
        secondaryLink: {
          href: "https://github.com/Anish-2005/LawAI-PrivacyV",
          label: "Source Repository",
        },
      },
      {
        id: "sih-nyantra",
        title: "Nyantra: DBT Social Assistance Platform",
        summary:
          "SIH 2025 finalist platform designed to streamline Direct Benefit Transfer operations with ML-assisted workflows and transparent disbursement tracking.",
        badge: "SIH Finalist",
        tag: "GovTech and Welfare - 2025",
        focusArea: "GovTech and Welfare",
        year: 2025,
        meta: [
          {
            label: "Mission",
            value: "Increase delivery quality across DBT welfare programs",
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
        primaryLink: { href: "/decks/sih-nyantra.pdf", label: "Open Deck" },
        secondaryLink: {
          href: "https://github.com/Anish-2005/Nyantra",
          label: "Source Repository",
        },
      },
    ],
  },
  {
    id: "internal",
    label: "Internal Validation Track",
    title: "Pre-Final Internal Decks",
    description:
      "Institutional and mentor-review presentations that shaped final SIH submissions before jury rounds.",
    accent: "emerald",
    iconName: "BookOpen",
    decks: [
      {
        id: "internal-vanmitra",
        title: "VanMitra: Forest Rights Atlas and DSS",
        summary:
          "Internal SIH 2025 concept combining geospatial rights mapping, OCR-assisted claims processing, and decision-support analytics.",
        badge: "Internal SIH",
        tag: "ForestTech - 2025",
        focusArea: "ForestTech",
        year: 2025,
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
          label: "Open Deck",
        },
        secondaryLink: {
          href: "https://github.com/Anish-2005/VanMitra",
          label: "Source Repository",
        },
      },
      {
        id: "internal-chatbot-ticketing",
        title: "Museum Concierge: Chatbot Ticketing System",
        summary:
          "Internal SIH 2024 solution using conversational AI to automate ticketing, visitor guidance, and queue visibility for museum operations.",
        badge: "Internal SIH",
        tag: "Museums - 2024",
        focusArea: "GovTech and Welfare",
        year: 2024,
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
          label: "Open Deck",
        },
        secondaryLink: {
          href: "https://github.com/Anish-2005/Online-Chatbot-Based-Ticketing-System",
          label: "Source Repository",
        },
      },
    ],
  },
  {
    id: "non-sih",
    label: "Selected Work",
    title: "Independent and Client Decks",
    description:
      "Reserved for startup, client, and independent innovation presentations outside the SIH track.",
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
  { label: "SIH Finalist Entries", value: "2" },
];

export const focusAreasList = ["LegalTech", "GovTech and Welfare", "ForestTech"];

