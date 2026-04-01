import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CollectionSection } from "@/components/collection-section";
import { Footer } from "@/components/footer";
import { deckCollections } from "@/lib/data";

export default function Home() {
  return (
    <div className="app-shell">
      <div className="floating-orb animate-float -left-32 top-2 h-96 w-96" style={{ background: "var(--hero-glow-a)" }} aria-hidden />
      <div className="floating-orb animate-float-slow -right-20 top-64 h-[22rem] w-[22rem]" style={{ background: "var(--hero-glow-b)" }} aria-hidden />
      <div className="floating-orb animate-float left-1/3 bottom-8 h-80 w-80" style={{ background: "var(--hero-glow-c)" }} aria-hidden />

      <Navbar />
      <Hero />

      <main id="collections" className="page-container flex flex-col gap-6 pb-10 sm:gap-8 lg:gap-10">
        {deckCollections.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))}
      </main>

      <div className="page-container pb-10 sm:pb-14">
        <Footer />
      </div>
    </div>
  );
}

