import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { DeckExplorer } from "@/components/deck-explorer";
import { Footer } from "@/components/footer";
import { deckCollections } from "@/lib/data";

export default function Home() {
  return (
    <div className="app-shell">
      <div
        className="floating-orb animate-float -left-32 top-2 h-96 w-96"
        style={{ background: "var(--hero-glow-a)" }}
        aria-hidden
      />
      <div
        className="floating-orb animate-float-slow -right-20 top-64 h-[22rem] w-[22rem]"
        style={{ background: "var(--hero-glow-b)" }}
        aria-hidden
      />
      <div
        className="floating-orb animate-float left-1/3 bottom-8 h-80 w-80"
        style={{ background: "var(--hero-glow-c)" }}
        aria-hidden
      />

      <Navbar />
      <Hero />

      <main id="collections" className="page-container pb-10 sm:pb-12">
        <Suspense
          fallback={
            <section className="section-shell overflow-hidden p-6 sm:p-8">
              <div className="collection-glow collection-glow-cyan" aria-hidden />
              <div className="explorer-skeleton-stack" aria-hidden>
                <div className="explorer-skeleton skeleton-title" />
                <div className="explorer-skeleton skeleton-line" />
                <div className="explorer-skeleton skeleton-line short" />
                <div className="explorer-skeleton-grid">
                  <div className="explorer-skeleton skeleton-card" />
                  <div className="explorer-skeleton skeleton-card" />
                </div>
              </div>
            </section>
          }
        >
          <DeckExplorer collections={deckCollections} />
        </Suspense>
      </main>

      <div className="page-container pb-10 sm:pb-14">
        <Footer />
      </div>
    </div>
  );
}
