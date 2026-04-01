"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CollectionSection } from "@/components/collection-section";
import type { Deck, DeckCollection } from "@/lib/types";

interface DeckExplorerProps {
  collections: DeckCollection[];
}

type FilteredCollection = {
  collection: DeckCollection;
  decks: Deck[];
};

type SortOrder = "newest" | "oldest" | "az" | "relevance";

const sortOptions: Array<{
  id: SortOrder;
  label: string;
}> = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "az", label: "A to Z" },
  { id: "relevance", label: "Most relevant" },
];

function computeQueryRelevance(deck: Deck, query: string) {
  const lowered = query.toLowerCase();
  let score = 0;

  if (deck.title.toLowerCase().includes(lowered)) {
    score += 6;
  }

  if (deck.summary.toLowerCase().includes(lowered)) {
    score += 4;
  }

  if (deck.focusArea.toLowerCase().includes(lowered)) {
    score += 3;
  }

  if (deck.tag.toLowerCase().includes(lowered) || deck.badge.toLowerCase().includes(lowered)) {
    score += 2;
  }

  for (const metaItem of deck.meta) {
    if (metaItem.label.toLowerCase().includes(lowered) || metaItem.value.toLowerCase().includes(lowered)) {
      score += 1;
    }
  }

  return score;
}

export function DeckExplorer({ collections }: DeckExplorerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [trackFilter, setTrackFilter] = useState(() => searchParams.get("track") ?? "all");
  const [focusFilter, setFocusFilter] = useState(() => searchParams.get("focus") ?? "all");
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const fromParams = searchParams.get("sort");

    if (fromParams === "newest" || fromParams === "oldest" || fromParams === "az" || fromParams === "relevance") {
      return fromParams;
    }

    return "newest";
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const validTrackIds = useMemo(
    () => new Set(["all", ...collections.map((collection) => collection.id)]),
    [collections],
  );

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

  const validFocusIds = useMemo(() => new Set(focusOptions), [focusOptions]);
  const resolvedTrackFilter = validTrackIds.has(trackFilter) ? trackFilter : "all";
  const resolvedFocusFilter = validFocusIds.has(focusFilter) ? focusFilter : "all";

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    if (resolvedTrackFilter !== "all") {
      params.set("track", resolvedTrackFilter);
    }

    if (resolvedFocusFilter !== "all") {
      params.set("focus", resolvedFocusFilter);
    }

    if (sortOrder !== "newest") {
      params.set("sort", sortOrder);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [
    pathname,
    resolvedFocusFilter,
    resolvedTrackFilter,
    router,
    searchQuery,
    sortOrder,
  ]);

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isEditing =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.isContentEditable;

      if (event.key === "/" && !isEditing) {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }

      if (event.key === "Escape" && activeElement === searchInputRef.current && searchQuery) {
        event.preventDefault();
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [searchQuery]);

  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    resolvedTrackFilter !== "all" ||
    resolvedFocusFilter !== "all" ||
    sortOrder !== "newest";

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

    const compareDecks = (first: Deck, second: Deck) => {
      if (sortOrder === "relevance" && normalizedQuery) {
        const firstScore = computeQueryRelevance(first, normalizedQuery);
        const secondScore = computeQueryRelevance(second, normalizedQuery);

        if (secondScore !== firstScore) {
          return secondScore - firstScore;
        }
      }

      if (sortOrder === "oldest") {
        if (first.year !== second.year) {
          return first.year - second.year;
        }
      } else if (sortOrder === "az") {
        const alphabetical = first.title.localeCompare(second.title);

        if (alphabetical !== 0) {
          return alphabetical;
        }
      } else {
        if (second.year !== first.year) {
          return second.year - first.year;
        }
      }

      return first.title.localeCompare(second.title);
    };

    return collections
      .map((collection) => {
        const decks = collection.decks
          .filter(
            () => resolvedTrackFilter === "all" || collection.id === resolvedTrackFilter,
          )
          .filter(
            (deck) =>
              resolvedFocusFilter === "all" || deck.focusArea === resolvedFocusFilter,
          )
          .filter((deck) => matchDeckAgainstQuery(deck, collection))
          .sort(compareDecks);

        return { collection, decks };
      })
      .filter(
        ({ collection, decks }) =>
          decks.length > 0 || (!hasActiveFilters && collection.comingSoon),
      );
  }, [
    collections,
    resolvedFocusFilter,
    resolvedTrackFilter,
    hasActiveFilters,
    normalizedQuery,
    sortOrder,
  ]);

  const visibleDeckCount = useMemo(
    () => filteredCollections.reduce((total, item) => total + item.decks.length, 0),
    [filteredCollections],
  );

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setTrackFilter("all");
    setFocusFilter("all");
    setSortOrder("newest");
  }, []);

  const removeTrackFilter = useCallback(() => setTrackFilter("all"), []);
  const removeFocusFilter = useCallback(() => setFocusFilter("all"), []);
  const removeSortFilter = useCallback(() => setSortOrder("newest"), []);

  const jumpToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const activeTrackLabel =
    trackOptions.find((option) => option.id === resolvedTrackFilter)?.label ??
    "Selected Track";

  const activeSortLabel =
    sortOptions.find((option) => option.id === sortOrder)?.label ?? "Sort";

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <section
        id="deck-explorer"
        className="section-shell explorer-shell overflow-hidden p-5 sm:p-7 lg:p-8"
      >
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
              Search across titles, summaries, metadata, and technology tags, then narrow results by track, focus area, and sort order.
            </p>
          </div>

          <div className="explorer-search-wrap">
            <Search size={16} className="explorer-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search decks by title, problem space, stack, or year..."
              className="explorer-search-input"
              aria-label="Search decks"
            />
            {!searchQuery ? (
              <kbd className="explorer-shortcut-hint" aria-hidden>
                /
              </kbd>
            ) : null}
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

          <div className="explorer-toolbar-row">
            <div className="explorer-sort-wrap">
              <label htmlFor="deck-sort" className="explorer-filter-label">
                Sort
              </label>
              <select
                id="deck-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="explorer-sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-secondary" onClick={jumpToResults}>
              Jump to Results
            </button>
          </div>

          <div className="explorer-filter-group">
            <p className="explorer-filter-label">Track</p>
            <div className="explorer-filter-row">
              {trackOptions.map((option) => {
                const isResolvedActive = resolvedTrackFilter === option.id;
                const isDisabled = option.id !== "all" && option.count === 0;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTrackFilter(option.id)}
                    disabled={isDisabled}
                    className={`explorer-filter-pill ${isResolvedActive ? "is-active" : ""}`}
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
                const isActive = resolvedFocusFilter === option;
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

          {hasActiveFilters ? (
            <div className="explorer-active-filters" role="region" aria-label="Active filters">
              <p className="explorer-filter-label">Active Filters</p>
              <div className="explorer-filter-row">
                {normalizedQuery ? (
                  <button type="button" className="explorer-filter-pill is-active" onClick={() => setSearchQuery("")}>
                    Search: &quot;{searchQuery.trim()}&quot;
                    <X size={12} />
                  </button>
                ) : null}

                {resolvedTrackFilter !== "all" ? (
                  <button type="button" className="explorer-filter-pill is-active" onClick={removeTrackFilter}>
                    Track: {activeTrackLabel}
                    <X size={12} />
                  </button>
                ) : null}

                {resolvedFocusFilter !== "all" ? (
                  <button type="button" className="explorer-filter-pill is-active" onClick={removeFocusFilter}>
                    Focus: {resolvedFocusFilter}
                    <X size={12} />
                  </button>
                ) : null}

                {sortOrder !== "newest" ? (
                  <button type="button" className="explorer-filter-pill is-active" onClick={removeSortFilter}>
                    Sort: {activeSortLabel}
                    <X size={12} />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="explorer-summary">
            <p className="text-sm text-[color:var(--text-base)]">
              Showing <span className="font-bold text-[color:var(--text-strong)]">{visibleDeckCount}</span> of{" "}
              <span className="font-bold text-[color:var(--text-strong)]">{totalDeckCount}</span> decks
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-ghost explorer-reset"
              >
                Reset all
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div ref={resultsRef} className="explorer-results-anchor" aria-hidden />

      {visibleDeckCount === 0 ? (
        <section className="section-shell overflow-hidden p-6 sm:p-8">
          <div className="collection-glow collection-glow-amber" aria-hidden />
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">
              No decks match these filters
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[color:var(--text-base)]">
              Try broadening your query, switching sort order, or resetting filters to return to the full deck library.
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
