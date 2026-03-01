import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CollectionSection } from "@/components/collection-section";
import { Footer } from "@/components/footer";
import { deckCollections } from "@/lib/data";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--page-bg)] transition-colors">
      <Navbar />

      <Hero />

      <main
        id="collections"
        className="page-container flex flex-col gap-8 pb-8 sm:gap-10"
      >
        {deckCollections.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))}
      </main>

      <div className="page-container pb-10">
        <Footer />
      </div>
    </div>
  );
}
