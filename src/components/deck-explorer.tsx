"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CollectionSection } from "@/components/collection-section";
import type { Deck, DeckCollection } from "@/lib/types";

interface DeckExplorerProps {
  collections: DeckCollection[];
}

type FilteredCollection = {
  collection: DeckCollection;
  decks: Deck[];
};

export function DeckExplorer({ collections }: DeckExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const totalDeckCount = useMemo(
    () => collections.reduce((total, collection) => total + collection.decks.length, 0),
    [collections],
  );

  const trackOptions = useMemo(
    () => [
      { id: "all", label: "All Tracks", count: totalDeckCount },
      ...collections.map((collection) => ({
        id: collection.id,
        label: collection.label,
        count: collection.decks.length,
      })),
    ],
    [collections, totalDeckCount],
  );

  const focusOptions = useMemo(() => {
    const uniqueFocusAreas = new Set<string>();

    for (const collection of collections) {
      for (const deck of collection.decks) {
        uniqueFocusAreas.add(deck.focusArea);
      }
    }

    return ["all", ...Array.from(uniqueFocusAreas)];
  }, [collections]);

  const hasActiveFilters =
    normalizedQuery.length > 0 || trackFilter !== "all" || focusFilter !== "all";

  const filteredCollections = useMemo<FilteredCollection[]>(() => {
    const matchDeckAgainstQuery = (deck: Deck, collection: DeckCollection) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableFields = [
        collection.label,
        collection.title,
        deck.title,
        deck.summary,
        deck.tag,
        deck.badge,
        deck.focusArea,
        String(deck.year),
        ...deck.meta.map((item) => item.label),
        ...deck.meta.map((item) => item.value),
      ];

      return searchableFields.join(" ").toLowerCase().includes(normalizedQuery);
    };

    return collections
      .map((collection) => {
        const decks = collection.decks
          .filter(() => trackFilter === "all" || collection.id === trackFilter)
          .filter((deck) => focusFilter === "all" || deck.focusArea === focusFilter)
          .filter((deck) => matchDeckAgainstQuery(deck, collection))
          .sort((first, second) => {
            if (second.year !== first.year) {
              return second.year - first.year;
            }

            return first.title.localeCompare(second.title);
          });

        return { collection, decks };
      })
      .filter(
        ({ collection, decks }) =>
          decks.length > 0 || (!hasActiveFilters && collection.comingSoon),
      );
  }, [collections, focusFilter, hasActiveFilters, normalizedQuery, trackFilter]);

  const visibleDeckCount = useMemo(
    () => filteredCollections.reduce((total, item) => total + item.decks.length, 0),
    [filteredCollections],
  );

  const resetFilters = () => {
    setSearchQuery("");
    setTrackFilter("all");
    setFocusFilter("all");
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <section id="deck-explorer" className="section-shell explorer-shell overflow-hidden p-5 sm:p-7 lg:p-8">
        <div className="collection-glow collection-glow-cyan" aria-hidden />

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <span className="kicker w-fit">
              <SlidersHorizontal size={13} />
              Smart Deck Explorer
            </span>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[color:var(--text-strong)] sm:text-[1.95rem]">
              Find the right deck in seconds
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[color:var(--text-base)] sm:text-[0.95rem]">
              Search across titles, summaries, metadata, and technology tags, then narrow results by track and focus area.
            </p>
          </div>

          <div className="explorer-search-wrap">
            <Search size={16} className="explorer-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search decks by title, problem space, stack, or year..."
              className="explorer-search-input"
              aria-label="Search decks"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="explorer-search-clear"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="explorer-filter-group">
            <p className="explorer-filter-label">Track</p>
            <div className="explorer-filter-row">
              {trackOptions.map((option) => {
                const isActive = trackFilter === option.id;
                const isDisabled = option.id !== "all" && option.count === 0;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTrackFilter(option.id)}
                    disabled={isDisabled}
                    className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                  >
                    <span>{option.label}</span>
                    <span className="explorer-pill-count">{option.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="explorer-filter-group">
            <p className="explorer-filter-label">Focus Area</p>
            <div className="explorer-filter-row">
              {focusOptions.map((option) => {
                const isActive = focusFilter === option;
                const optionLabel = option === "all" ? "All Areas" : option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFocusFilter(option)}
                    className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                  >
                    {optionLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="explorer-summary">
            <p className="text-sm text-[color:var(--text-base)]">
              Showing <span className="font-bold text-[color:var(--text-strong)]">{visibleDeckCount}</span> of{" "}
              <span className="font-bold text-[color:var(--text-strong)]">{totalDeckCount}</span> decks
            </p>
            {hasActiveFilters ? (
              <button type="button" onClick={resetFilters} className="btn btn-ghost explorer-reset">
                Reset filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {visibleDeckCount === 0 ? (
        <section className="section-shell overflow-hidden p-6 sm:p-8">
          <div className="collection-glow collection-glow-amber" aria-hidden />
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">No decks match these filters</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[color:var(--text-base)]">
              Try broadening your search query or resetting filters to return to the complete deck library.
            </p>
            <button type="button" onClick={resetFilters} className="btn btn-secondary mt-4">
              Clear search and filters
            </button>
          </div>
        </section>
      ) : (
        filteredCollections.map(({ collection, decks }) => (
          <CollectionSection
            key={collection.id}
            collection={{ ...collection, decks }}
            totalDeckCount={collection.decks.length}
          />
        ))
      )}
    </div>
  );
}
