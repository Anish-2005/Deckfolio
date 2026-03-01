/* ─────────────────────────────────────────────
   Deckfolio – Data Layer
   Single source of truth for all deck content.
   ───────────────────────────────────────────── */

import type { DeckCollection, HeroStat } from "./types";

export const deckCollections: DeckCollection[] = [
    {
        id: "sih",
        label: "National-Level Finalist (SIH)",
        title: "Smart India Hackathon – Finalist Decks",
        description:
            "Built for juries and ministry stakeholders. These decks highlight clarity, measurable impact, and implementation readiness.",
        accent: "cyan",
        iconName: "Trophy",
        decks: [
            {
                id: "sih-lawai",
                title: "LawAI: AI-Powered Legal Assistant",
                summary:
                    "Smart India Hackathon 2024 finalist experience that democratizes legal knowledge with intelligent FIR guidance, AI lawyer consultations, and a secure document vault.",
                badge: "SIH Finalist",
                tag: "AI + LegalTech · 2024",
                meta: [
                    {
                        label: "Impact",
                        value: "Making legal assistance accessible to 1.4B Indians",
                    },
                    {
                        label: "Highlights",
                        value:
                            "Intelligent FIR builder · AI lawyer · Comprehensive legal database",
                    },
                    { label: "Tech Stack", value: "React Native · Expo · AI/ML" },
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
                    "Smart India Hackathon 2025 finalist platform that streamlines Direct Benefit Transfer workflows with ML-powered welfare management and transparent disbursement tracking.",
                badge: "SIH Finalist",
                tag: "Gov Welfare · 2025",
                meta: [
                    {
                        label: "Mission",
                        value: "ML-powered welfare management for DBT schemes",
                    },
                    {
                        label: "Status",
                        value: "Advanced to SIH 2025 national finals",
                    },
                    { label: "Tech Stack", value: "Next.js · TypeScript · ML" },
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
        label: "Internal & Academic",
        title: "SIH Internal Project Decks",
        description:
            "Institution-only walkthroughs and SIH internal iterations that shaped the finalist submissions ahead of jury and mentor reviews.",
        accent: "emerald",
        iconName: "BookOpen",
        decks: [
            {
                id: "internal-vanmitra",
                title: "VanMitra: Forest Rights Atlas & DSS",
                summary:
                    "SIH 2025 internal build mapping forest rights, OCR claim workflows, and decision-support dashboards to accelerate VanMitra's finalist delivery.",
                badge: "Internal SIH",
                tag: "ForestTech · 2025",
                meta: [
                    {
                        label: "Use Case",
                        value:
                            "Forest rights mapping & asset tracking for FRA communities",
                    },
                    {
                        label: "Highlights",
                        value: "MapLibre atlas · OCR claims · DSS dashboards",
                    },
                    {
                        label: "Tech Stack",
                        value: "Next.js · MapLibre · Framer Motion",
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
                title: "Online Chatbot Ticketing System: Museum Concierge",
                summary:
                    "SIH 2024 internal system using conversational AI to automate ticket booking, visitor guidance, and queue insights for museums.",
                badge: "Internal SIH",
                tag: "Museums · 2024",
                meta: [
                    {
                        label: "Use Case",
                        value: "Chatbot-led ticketing & slot management",
                    },
                    {
                        label: "Highlights",
                        value: "Visitor Q&A · Guided tours · Ops analytics",
                    },
                    { label: "Tech Stack", value: "React · FastAPI · MongoDB" },
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
            "Pitch decks and innovation presentations outside the Smart India Hackathon track. This space will showcase flagship client and startup decks soon.",
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
    { label: "Finalist Wins", value: "2", suffix: "x SIH" },
];

export const focusAreasList = [
    "LegalTech",
    "Welfare & GovTech",
    "ForestTech",
];
