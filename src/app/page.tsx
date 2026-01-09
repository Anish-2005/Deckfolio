type DeckMeta = {
  label: string;
  value: string;
};

type Deck = {
  title: string;
  summary: string;
  badge: string;
  tag: string;
  meta: DeckMeta[];
  primaryLink: { href: string; label: string };
  secondaryLink?: { href: string; label: string };
};

type DeckCollection = {
  id: string;
  label: string;
  title: string;
  description: string;
  accent: string;
  decks: Deck[];
};

const deckCollections: DeckCollection[] = [
  {
    id: "sih",
    label: "National-Level Finalist (SIH)",
    title: "Smart India Hackathon – Finalist Decks",
    description:
      "Built for juries and ministry stakeholders. These decks highlight clarity, measurable impact, and implementation readiness.",
    accent: "from-teal-400/25 via-sky-400/20 to-transparent",
    decks: [
      {
        title: "LawAI: AI-Powered Legal Assistant",
        summary:
          "Smart India Hackathon 2024 finalist experience that democratizes legal knowledge with intelligent FIR guidance, AI lawyer consultations, and a secure document vault.",
        badge: "SIH Finalist",
        tag: "AI + LegalTech · 2024",
        meta: [
          { label: "Impact", value: "Making legal assistance accessible to 1.4B Indians" },
          {
            label: "Highlights",
            value: "Intelligent FIR builder · AI lawyer · Comprehensive legal database",
          },
          { label: "Tech Stack", value: "React Native · Expo · AI/ML" },
        ],
        primaryLink: { href: "/decks/sih-lawai.pdf", label: "View Deck" },
        secondaryLink: { href: "https://github.com/Anish-2005/LawAI-Mobile", label: "View on GitHub" },
      },
      {
        title: "Nyantra: DBT Social Assistance Platform",
        summary:
          "Smart India Hackathon 2025 finalist platform that streamlines Direct Benefit Transfer workflows with ML-powered welfare management and transparent disbursement tracking.",
        badge: "SIH Finalist",
        tag: "Gov Welfare · 2025",
        meta: [
          { label: "Mission", value: "ML-powered welfare management for DBT schemes" },
          { label: "Status", value: "Advanced to SIH 2025 national finals" },
          { label: "Tech Stack", value: "Next.js · TypeScript · ML" },
        ],
        primaryLink: { href: "/decks/sih-nyantra.pdf", label: "View Deck" },
        secondaryLink: { href: "https://anishseth.xyz/#projects", label: "Project Overview" },
      },
    ],
  },
  {
    id: "internal",
    label: "Internal & Academic",
    title: "SIH Internal Project Decks",
    description:
      "Institution-only walkthroughs and SIH internal iterations that shaped the finalist submissions ahead of jury and mentor reviews.",
    accent: "from-emerald-300/20 via-cyan-300/10 to-transparent",
    decks: [
      {
        title: "VanMitra: Forest Rights Atlas & DSS",
        summary:
          "SIH 2025 internal build mapping forest rights, OCR claim workflows, and decision-support dashboards to accelerate VanMitra's finalist delivery.",
        badge: "Internal SIH",
        tag: "ForestTech · 2025",
        meta: [
          { label: "Use Case", value: "Forest rights mapping & asset tracking for FRA communities" },
          { label: "Highlights", value: "MapLibre atlas · OCR claims · DSS dashboards" },
          { label: "Tech Stack", value: "Next.js · MapLibre · Framer Motion" },
        ],
        primaryLink: { href: "/decks/internal-vanmitra.pdf", label: "View Deck" },
        secondaryLink: { href: "https://github.com/Anish-2005/VanMitra", label: "View on GitHub" },
      },
      {
        title: "Online Chatbot Ticketing System: Museum Concierge",
        summary:
          "SIH 2024 internal system using conversational AI to automate ticket booking, visitor guidance, and queue insights for museums.",
        badge: "Internal SIH",
        tag: "Museums · 2024",
        meta: [
          { label: "Use Case", value: "Chatbot-led ticketing & slot management" },
          { label: "Highlights", value: "Visitor Q&A · Guided tours · Ops analytics" },
          { label: "Tech Stack", value: "React · FastAPI · MongoDB" },
        ],
        primaryLink: { href: "/decks/internal-chatbot-ticketing.pdf", label: "View Deck" },
        secondaryLink: { href: "https://anishseth.xyz/#projects", label: "Project Overview" },
      },
    ],
  },
];

const totalDecks = deckCollections.reduce(
  (count, collection) => count + collection.decks.length,
  0,
);

const heroStats = [
  { label: "Total Decks", value: totalDecks.toString() },
  { label: "Focus Areas", value: "LegalTech · Welfare · ForestTech" },
  { label: "Last Updated", value: "Jan 2026" },
];

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#05060a]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        aria-hidden
      >
        <div className="absolute left-0 top-0 h-80 w-80 -translate-y-20 translate-x-10 rounded-full bg-cyan-400/20 blur-[140px]" />
        <div className="absolute right-0 top-16 h-72 w-72 translate-x-10 rounded-full bg-emerald-300/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 pb-24 pt-10 lg:px-10">
        <header className="flex flex-col gap-10">
          <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/70">
              Deckfolio
            </span>
            <div className="flex flex-wrap gap-3">
              <a
                href="#collections"
                className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
              >
                View Decks
              </a>
              <a
                href="mailto:anish@example.com?subject=Deckfolio%20Inquiry"
                className="rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400 px-4 py-2 text-sm font-medium text-gray-900 transition hover:shadow-lg"
              >
                Request Case Study
              </a>
            </div>
          </nav>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">
                Presentation Showcase
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Smart India Hackathon finalist decks + internal innovations, in one recruiter-ready lane.
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-white/70">
                Each deck card links directly to the slide file you want decision makers to see first. Clean naming,
                quick context, and portfolio polish for juries, recruiters, and faculty reviews.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm uppercase tracking-[0.3em] text-white/60 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2 text-left">
                  <span>{stat.label}</span>
                  <span className="text-2xl font-semibold tracking-normal text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main id="collections" className="flex flex-col gap-12">
          {deckCollections.map((collection) => (
            <section
              key={collection.id}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(8,10,18,0.65)] sm:p-10"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${collection.accent} opacity-70 blur-[160px]`}
                aria-hidden
              />
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.5em] text-white/60">
                  {collection.label}
                </p>
                <div className="flex flex-col gap-3">
                  <h2 className="text-3xl font-semibold text-white">
                    {collection.title}
                  </h2>
                  <p className="max-w-3xl text-base leading-relaxed text-white/70">
                    {collection.description}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {collection.decks.map((deck) => (
                  <article
                    key={deck.title}
                    className="group relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                  >
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                      <span className="rounded-full border border-white/20 px-3 py-1 text-[0.65rem]">
                        {deck.badge}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem]">
                        {deck.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {deck.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-white/70">
                        {deck.summary}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-4 text-sm text-white/70">
                      {deck.meta.map((item) => (
                        <li key={item.label}>
                          <span className="block text-[0.65rem] uppercase tracking-[0.4em] text-white/50">
                            {item.label}
                          </span>
                          <span className="text-base text-white">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <a
                        href={deck.primaryLink.href}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:shadow-lg"
                      >
                        {deck.primaryLink.label}
                      </a>
                      {deck.secondaryLink && (
                        <a
                          href={deck.secondaryLink.href}
                          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/25 px-4 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                        >
                          {deck.secondaryLink.label}
                        </a>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 opacity-0 transition group-hover:opacity-100" />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-white shadow-[0_10px_50px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">
            Need another deck?
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <h2 className="text-3xl font-semibold">Future-ready presentations stay here.</h2>
            <p className="max-w-3xl text-base text-white/70">
              Extend Deckfolio with Proof-of-Concepts, Startup Pitch Decks, or Research Posters. Duplicate any card,
              swap the metadata, and point the button to your PPT or PDF.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:anish@example.com?subject=Deckfolio%20Collaboration"
                className="rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-300 px-5 py-3 text-sm font-semibold text-gray-900"
              >
                Collaborate
              </a>
              <a
                href="#collections"
                className="rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:border-white"
              >
                Back to Decks
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
