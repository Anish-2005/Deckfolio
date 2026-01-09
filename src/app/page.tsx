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
        title: "PulseShield — Emergency Response Network",
        summary:
          "Decision support mesh coordinating ambulances, police, and campus security with live telemetry and automated triage scoring.",
        badge: "National Finalist",
        tag: "Urban Tech · 2025",
        meta: [
          { label: "Problem Statement", value: "SIH 2025 · Ministry of Home Affairs" },
          { label: "Role", value: "Product lead · UX · Demo build" },
          { label: "Deck Length", value: "22 slides" },
        ],
        primaryLink: { href: "/decks/sih-pulseshield.pdf", label: "View Deck" },
        secondaryLink: { href: "https://example.com/pulseshield", label: "Read Summary" },
      },
      {
        title: "AgroSense — Precision Farming OS",
        summary:
          "Satellite-guided irrigation scheduling, agronomy advisory, and credit-readiness scoring tailored for smallholder cooperatives.",
        badge: "National Finalist",
        tag: "AgriTech · 2024",
        meta: [
          { label: "Problem Statement", value: "SIH 2024 · Ministry of Agriculture" },
          { label: "Role", value: "Product narrative · Data modeling" },
          { label: "Deck Length", value: "18 slides" },
        ],
        primaryLink: { href: "/decks/sih-agrosense.pdf", label: "View Deck" },
        secondaryLink: { href: "https://example.com/agrosense", label: "Read Summary" },
      },
    ],
  },
  {
    id: "internal",
    label: "Internal & Academic",
    title: "Internal Project Decks",
    description:
      "Institution-only walkthroughs, reviews, and research transfers. Deck names mirror campus documentation language for easy approvals.",
    accent: "from-emerald-300/20 via-cyan-300/10 to-transparent",
    decks: [
      {
        title: "CampusFlow — Facility Feedback Loop",
        summary:
          "Unified intake + analytics stack for hostels and labs with SLA-driven ticket routing and anonymized satisfaction reporting.",
        badge: "Internal Review",
        tag: "Ops · 2025",
        meta: [
          { label: "Audience", value: "Institute Innovation Council" },
          { label: "Role", value: "Process design · Prototype" },
          { label: "Deck Length", value: "15 slides" },
        ],
        primaryLink: { href: "/decks/internal-campusflow.pdf", label: "View Deck" },
        secondaryLink: { href: "https://example.com/campusflow", label: "Read Summary" },
      },
      {
        title: "InsightBeam — Institutional Data Room",
        summary:
          "Privacy-first knowledge base aggregating research posters, budgets, and lab assets with queryable metadata for dean-level planning.",
        badge: "Academic Review",
        tag: "AI Lab · 2024",
        meta: [
          { label: "Audience", value: "Academic Council" },
          { label: "Role", value: "Information architecture · Storytelling" },
          { label: "Deck Length", value: "17 slides" },
        ],
        primaryLink: { href: "/decks/internal-insightbeam.pdf", label: "View Deck" },
        secondaryLink: { href: "https://example.com/insightbeam", label: "Read Summary" },
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
  { label: "Focus Areas", value: "GovTech · CampusOps" },
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
