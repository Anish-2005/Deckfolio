
"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, Copy, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useDragControls,
} from "framer-motion";
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
type SourceFilter = "all" | "with-repo" | "deck-only";
type SheetSnap = "half" | "full";

type PersistedExplorerState = {
  q: string;
  track: string;
  focus: string[];
  year: string;
  source: SourceFilter;
  repoOnly: boolean;
  sort: SortOrder;
};

type IndexedDeck = {
  deck: Deck;
  searchBlob: string;
  tokens: string[];
  titleLower: string;
  summaryLower: string;
  focusLower: string;
  tagLower: string;
  badgeLower: string;
  metaBlobLower: string;
};

const STORAGE_KEY = "deckfolio.explorer.state.v1";
const QUERY_KEYS = ["q", "track", "focus", "year", "source", "repo", "sort"];

const sortOptions: Array<{ id: SortOrder; label: string }> = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "az", label: "A to Z" },
  { id: "relevance", label: "Most relevant" },
];

const sourceOptions: Array<{ id: SourceFilter; label: string }> = [
  { id: "all", label: "All Sources" },
  { id: "with-repo", label: "With Repository" },
  { id: "deck-only", label: "Deck Only" },
];

const chipMotion = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.95 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

function AnimatedCount({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        className={className}
        initial={{ opacity: 0, y: 7, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -7, filter: "blur(2px)" }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

function parseFocusParam(rawFocus: string | null): string[] {
  if (!rawFocus) {
    return [];
  }

  return rawFocus
    .split(",")
    .map((item) => decodeURIComponent(item).trim())
    .filter(Boolean);
}

function parseSortOrder(rawSort: string | null): SortOrder {
  if (
    rawSort === "newest" ||
    rawSort === "oldest" ||
    rawSort === "az" ||
    rawSort === "relevance"
  ) {
    return rawSort;
  }

  return "newest";
}

function parseSourceFilter(rawSource: string | null): SourceFilter {
  if (rawSource === "with-repo" || rawSource === "deck-only") {
    return rawSource;
  }

  return "all";
}

function tokenize(input: string): string[] {
  const tokens = input.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return Array.from(new Set(tokens.filter((token) => token.length > 1)));
}

function boundedLevenshtein(source: string, target: string, maxDistance: number): number {
  if (Math.abs(source.length - target.length) > maxDistance) {
    return maxDistance + 1;
  }

  const prev = new Array(target.length + 1);
  const curr = new Array(target.length + 1);

  for (let j = 0; j <= target.length; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= source.length; i += 1) {
    curr[0] = i;
    let minInRow = curr[0];

    for (let j = 1; j <= target.length; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);

      if (curr[j] < minInRow) {
        minInRow = curr[j];
      }
    }

    if (minInRow > maxDistance) {
      return maxDistance + 1;
    }

    for (let j = 0; j <= target.length; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[target.length];
}

function tokenMatchesWithFuzzy(queryToken: string, targetTokens: string[]): boolean {
  if (queryToken.length < 3) {
    return targetTokens.some((token) => token.startsWith(queryToken));
  }

  const maxDistance = queryToken.length >= 8 ? 2 : 1;

  return targetTokens.some((token) => {
    if (token.includes(queryToken) || queryToken.includes(token)) {
      return true;
    }

    return boundedLevenshtein(queryToken, token, maxDistance) <= maxDistance;
  });
}

function computeRelevanceScore(indexedDeck: IndexedDeck, queryTokens: string[]): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  let score = 0;

  for (const token of queryTokens) {
    if (indexedDeck.titleLower.includes(token)) {
      score += 8;
    }

    if (indexedDeck.summaryLower.includes(token)) {
      score += 5;
    }

    if (indexedDeck.focusLower.includes(token)) {
      score += 4;
    }

    if (indexedDeck.tagLower.includes(token) || indexedDeck.badgeLower.includes(token)) {
      score += 2;
    }

    if (indexedDeck.metaBlobLower.includes(token)) {
      score += 1;
    }
  }

  return score;
}

export function DeckExplorer({ collections }: DeckExplorerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const hasUrlState = QUERY_KEYS.some((key) => searchParams.get(key) !== null);

  const persistedState = useMemo((): PersistedExplorerState | null => {
    if (hasUrlState || typeof window === "undefined") {
      return null;
    }

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) {
        return null;
      }

      const parsedState = JSON.parse(rawState) as Partial<PersistedExplorerState>;

      return {
        q: parsedState.q ?? "",
        track: parsedState.track ?? "all",
        focus: Array.isArray(parsedState.focus)
          ? parsedState.focus.filter((item): item is string => typeof item === "string")
          : [],
        year: parsedState.year ?? "all",
        source: parseSourceFilter(parsedState.source ?? null),
        repoOnly: Boolean(parsedState.repoOnly),
        sort: parseSortOrder(parsedState.sort ?? null),
      };
    } catch {
      return null;
    }
  }, [hasUrlState]);

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") ?? persistedState?.q ?? "",
  );
  const [trackFilter, setTrackFilter] = useState(
    () => searchParams.get("track") ?? persistedState?.track ?? "all",
  );
  const [focusFilters, setFocusFilters] = useState<string[]>(() => {
    const fromQuery = parseFocusParam(searchParams.get("focus"));
    if (fromQuery.length > 0) {
      return fromQuery;
    }

    return persistedState?.focus ?? [];
  });
  const [yearFilter, setYearFilter] = useState(
    () => searchParams.get("year") ?? persistedState?.year ?? "all",
  );
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>(
    () => parseSourceFilter(searchParams.get("source") ?? persistedState?.source ?? null),
  );
  const [repoOnly, setRepoOnly] = useState(
    () => searchParams.get("repo") === "1" || Boolean(persistedState?.repoOnly),
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    () => parseSortOrder(searchParams.get("sort") ?? persistedState?.sort ?? null),
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("half");
  const [sheetHalfOffset, setSheetHalfOffset] = useState(250);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyTimeoutRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const deferredSearch = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearch.trim().toLowerCase();
  const searchTokens = useMemo(() => tokenize(normalizedQuery), [normalizedQuery]);
  const isResultsUpdating = deferredSearch !== searchQuery;

  const indexedCollections = useMemo(
    () =>
      collections.map((collection) => ({
        collection,
        indexedDecks: collection.decks.map((deck) => {
          const metaBlob = deck.meta.map((item) => `${item.label} ${item.value}`).join(" ");
          const searchBlob = [
            collection.label,
            collection.title,
            deck.title,
            deck.summary,
            deck.tag,
            deck.badge,
            deck.focusArea,
            String(deck.year),
            metaBlob,
          ]
            .join(" ")
            .toLowerCase();

          return {
            deck,
            searchBlob,
            tokens: tokenize(searchBlob),
            titleLower: deck.title.toLowerCase(),
            summaryLower: deck.summary.toLowerCase(),
            focusLower: deck.focusArea.toLowerCase(),
            tagLower: deck.tag.toLowerCase(),
            badgeLower: deck.badge.toLowerCase(),
            metaBlobLower: metaBlob.toLowerCase(),
          } satisfies IndexedDeck;
        }),
      })),
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

    return Array.from(uniqueFocusAreas);
  }, [collections]);

  const yearOptions = useMemo(() => {
    const uniqueYears = new Set<number>();

    for (const collection of collections) {
      for (const deck of collection.decks) {
        uniqueYears.add(deck.year);
      }
    }

    return Array.from(uniqueYears)
      .sort((first, second) => second - first)
      .map((year) => String(year));
  }, [collections]);

  const validTrackIds = useMemo(
    () => new Set(["all", ...collections.map((collection) => collection.id)]),
    [collections],
  );
  const validFocusIds = useMemo(() => new Set(focusOptions), [focusOptions]);
  const validYearIds = useMemo(() => new Set(["all", ...yearOptions]), [yearOptions]);

  const resolvedTrackFilter = validTrackIds.has(trackFilter) ? trackFilter : "all";
  const resolvedFocusFilters = useMemo(
    () =>
      Array.from(new Set(focusFilters)).filter((focusValue) => validFocusIds.has(focusValue)),
    [focusFilters, validFocusIds],
  );
  const resolvedYearFilter = validYearIds.has(yearFilter) ? yearFilter : "all";
  const resolvedSourceFilter = parseSourceFilter(sourceFilter);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    if (resolvedTrackFilter !== "all") {
      params.set("track", resolvedTrackFilter);
    }

    if (resolvedFocusFilters.length > 0) {
      params.set("focus", resolvedFocusFilters.join(","));
    }

    if (resolvedYearFilter !== "all") {
      params.set("year", resolvedYearFilter);
    }

    if (resolvedSourceFilter !== "all") {
      params.set("source", resolvedSourceFilter);
    }

    if (repoOnly) {
      params.set("repo", "1");
    }

    if (sortOrder !== "newest") {
      params.set("sort", sortOrder);
    }

    const queryString = params.toString();
    const currentQueryString = searchParams.toString();
    if (queryString === currentQueryString) {
      return;
    }

    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [
    pathname,
    repoOnly,
    resolvedFocusFilters,
    resolvedSourceFilter,
    resolvedTrackFilter,
    resolvedYearFilter,
    router,
    searchParams,
    searchQuery,
    sortOrder,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stateForPersistence: PersistedExplorerState = {
      q: searchQuery.trim(),
      track: resolvedTrackFilter,
      focus: resolvedFocusFilters,
      year: resolvedYearFilter,
      source: resolvedSourceFilter,
      repoOnly,
      sort: sortOrder,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateForPersistence));
  }, [
    repoOnly,
    resolvedFocusFilters,
    resolvedSourceFilter,
    resolvedTrackFilter,
    resolvedYearFilter,
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

      if (
        event.key === "Escape" &&
        activeElement === searchInputRef.current &&
        searchQuery
      ) {
        event.preventDefault();
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!isMobileFilterOpen || typeof document === "undefined") {
      return;
    }

    const { style } = document.body;
    const previousStyles = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      touchAction: style.touchAction,
    };

    lockedScrollYRef.current = window.scrollY;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${lockedScrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.touchAction = "none";

    return () => {
      style.overflow = previousStyles.overflow;
      style.position = previousStyles.position;
      style.top = previousStyles.top;
      style.left = previousStyles.left;
      style.right = previousStyles.right;
      style.width = previousStyles.width;
      style.touchAction = previousStyles.touchAction;
      window.scrollTo(0, lockedScrollYRef.current);
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    if (!isMobileFilterOpen || typeof window === "undefined") {
      return;
    }

    const updateSnapOffset = () => {
      const computedOffset = Math.round(
        Math.min(380, Math.max(180, window.innerHeight * 0.34)),
      );
      setSheetHalfOffset(computedOffset);
    };

    updateSnapOffset();
    window.addEventListener("resize", updateSnapOffset);

    return () => {
      window.removeEventListener("resize", updateSnapOffset);
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    resolvedTrackFilter !== "all" ||
    resolvedFocusFilters.length > 0 ||
    resolvedYearFilter !== "all" ||
    resolvedSourceFilter !== "all" ||
    repoOnly ||
    sortOrder !== "newest";

  const activeFilterCount =
    (normalizedQuery ? 1 : 0) +
    (resolvedTrackFilter !== "all" ? 1 : 0) +
    (resolvedFocusFilters.length > 0 ? 1 : 0) +
    (resolvedYearFilter !== "all" ? 1 : 0) +
    (resolvedSourceFilter !== "all" ? 1 : 0) +
    (repoOnly ? 1 : 0) +
    (sortOrder !== "newest" ? 1 : 0);

  const filteredCollections = useMemo<FilteredCollection[]>(() => {
    const queryMatches = (indexedDeck: IndexedDeck) => {
      if (searchTokens.length === 0) {
        return true;
      }

      return searchTokens.every((token) => {
        if (indexedDeck.searchBlob.includes(token)) {
          return true;
        }

        return tokenMatchesWithFuzzy(token, indexedDeck.tokens);
      });
    };

    const compareDecks = (first: IndexedDeck, second: IndexedDeck) => {
      if (sortOrder === "relevance" && searchTokens.length > 0) {
        const firstScore = computeRelevanceScore(first, searchTokens);
        const secondScore = computeRelevanceScore(second, searchTokens);

        if (secondScore !== firstScore) {
          return secondScore - firstScore;
        }
      }

      if (sortOrder === "oldest") {
        if (first.deck.year !== second.deck.year) {
          return first.deck.year - second.deck.year;
        }
      } else if (sortOrder === "az") {
        const alphabetical = first.deck.title.localeCompare(second.deck.title);
        if (alphabetical !== 0) {
          return alphabetical;
        }
      } else if (second.deck.year !== first.deck.year) {
        return second.deck.year - first.deck.year;
      }

      return first.deck.title.localeCompare(second.deck.title);
    };

    return indexedCollections
      .map(({ collection, indexedDecks }) => {
        const decks = indexedDecks
          .filter(
            () => resolvedTrackFilter === "all" || collection.id === resolvedTrackFilter,
          )
          .filter(
            (indexedDeck) =>
              resolvedFocusFilters.length === 0 ||
              resolvedFocusFilters.includes(indexedDeck.deck.focusArea),
          )
          .filter(
            (indexedDeck) =>
              resolvedYearFilter === "all" ||
              indexedDeck.deck.year === Number(resolvedYearFilter),
          )
          .filter((indexedDeck) => {
            if (resolvedSourceFilter === "with-repo") {
              return Boolean(indexedDeck.deck.secondaryLink);
            }

            if (resolvedSourceFilter === "deck-only") {
              return !indexedDeck.deck.secondaryLink;
            }

            return true;
          })
          .filter((indexedDeck) => !repoOnly || Boolean(indexedDeck.deck.secondaryLink))
          .filter(queryMatches)
          .sort(compareDecks)
          .map((indexedDeck) => indexedDeck.deck);

        return { collection, decks };
      })
      .filter(
        ({ collection, decks }) =>
          decks.length > 0 || (!hasActiveFilters && collection.comingSoon),
      );
  }, [
    hasActiveFilters,
    indexedCollections,
    repoOnly,
    resolvedFocusFilters,
    resolvedSourceFilter,
    resolvedTrackFilter,
    resolvedYearFilter,
    searchTokens,
    sortOrder,
  ]);

  const visibleDeckCount = useMemo(
    () => filteredCollections.reduce((total, item) => total + item.decks.length, 0),
    [filteredCollections],
  );

  const highlightTerms = useMemo(() => searchTokens.slice(0, 6), [searchTokens]);

  const firstVisibleDeck = useMemo(
    () => filteredCollections.find((collectionItem) => collectionItem.decks.length > 0)?.decks[0],
    [filteredCollections],
  );

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  }, []);

  const openMobileFilters = useCallback(() => {
    triggerHaptic();
    setSheetSnap("half");
    setIsMobileFilterOpen(true);
  }, [triggerHaptic]);

  const resetFilters = useCallback(() => {
    triggerHaptic();
    setSearchQuery("");
    setTrackFilter("all");
    setFocusFilters([]);
    setYearFilter("all");
    setSourceFilter("all");
    setRepoOnly(false);
    setSortOrder("newest");
  }, [triggerHaptic]);

  const applyTrackFilter = useCallback(
    (nextTrack: string) => {
      triggerHaptic();
      setTrackFilter(nextTrack);
    },
    [triggerHaptic],
  );

  const applyYearFilter = useCallback(
    (nextYear: string) => {
      triggerHaptic();
      setYearFilter(nextYear);
    },
    [triggerHaptic],
  );

  const applySourceFilter = useCallback(
    (nextSource: SourceFilter) => {
      triggerHaptic();
      setSourceFilter(nextSource);
    },
    [triggerHaptic],
  );

  const toggleRepoOnly = useCallback(() => {
    triggerHaptic();
    setRepoOnly((previousState) => !previousState);
  }, [triggerHaptic]);

  const toggleFocusFilter = useCallback((focusArea: string) => {
    triggerHaptic();
    setFocusFilters((previousFilters) => {
      if (previousFilters.includes(focusArea)) {
        return previousFilters.filter((item) => item !== focusArea);
      }

      return [...previousFilters, focusArea];
    });
  }, [triggerHaptic]);

  const jumpToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSheetDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 180 || info.velocity.y > 920) {
        setIsMobileFilterOpen(false);
        return;
      }

      if (info.offset.y < -70 || info.velocity.y < -620) {
        setSheetSnap("full");
        return;
      }

      if (info.offset.y > 60 || info.velocity.y > 260) {
        setSheetSnap("half");
      }
    },
    [],
  );

  const copyFilteredView = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setLinkCopied(false);
      }, 1800);
    } catch {
      setLinkCopied(false);
    }
  }, []);

  const applyPreset = useCallback((preset: "sih-2025" | "internal-repo" | "legaltech") => {
    triggerHaptic();

    if (preset === "sih-2025") {
      setTrackFilter("sih");
      setYearFilter("2025");
      setFocusFilters([]);
      setSourceFilter("all");
      setRepoOnly(false);
      setSortOrder("newest");
      setSearchQuery("");
    }

    if (preset === "internal-repo") {
      setTrackFilter("internal");
      setYearFilter("all");
      setFocusFilters([]);
      setSourceFilter("with-repo");
      setRepoOnly(true);
      setSortOrder("newest");
      setSearchQuery("");
    }

    if (preset === "legaltech") {
      setTrackFilter("all");
      setYearFilter("all");
      setFocusFilters(["LegalTech"]);
      setSourceFilter("all");
      setRepoOnly(false);
      setSortOrder("relevance");
      setSearchQuery("legal assistant");
    }

    setIsMobileFilterOpen(false);
  }, [triggerHaptic]);

  const activeTrackLabel =
    trackOptions.find((option) => option.id === resolvedTrackFilter)?.label ?? "Selected Track";
  const activeSortLabel =
    sortOptions.find((option) => option.id === sortOrder)?.label ?? "Sort";

  const resultsKey = [
    normalizedQuery,
    resolvedTrackFilter,
    resolvedFocusFilters.join(","),
    resolvedYearFilter,
    resolvedSourceFilter,
    repoOnly ? "repo" : "all",
    sortOrder,
    visibleDeckCount,
  ].join("|");

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <section
        id="deck-explorer"
        className="section-shell explorer-shell overflow-hidden p-4 sm:p-7 lg:p-8"
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
              Search with typo tolerance, filter by track/focus/year/source, and share your filtered review view.
            </p>
          </div>

          <div className="explorer-search-wrap">
            <Search size={16} className="explorer-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search decks by title, problem, stack, focus area, or year..."
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

          <div className="explorer-preset-row" role="group" aria-label="Quick presets">
            <button type="button" className="explorer-filter-pill" onClick={() => applyPreset("sih-2025")}>
              SIH 2025
            </button>
            <button
              type="button"
              className="explorer-filter-pill"
              onClick={() => applyPreset("internal-repo")}
            >
              Internal + Repo
            </button>
            <button type="button" className="explorer-filter-pill" onClick={() => applyPreset("legaltech")}>
              LegalTech Spotlight
            </button>
          </div>

          <div className="explorer-toolbar-row">
            <div className="explorer-sort-wrap">
              <label htmlFor="deck-sort" className="explorer-filter-label">
                Sort
              </label>
              <select
                id="deck-sort"
                value={sortOrder}
                onChange={(event) => {
                  triggerHaptic();
                  setSortOrder(event.target.value as SortOrder);
                }}
                className="explorer-sort-select"
                aria-label="Sort deck results"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-secondary sm:hidden"
                onClick={openMobileFilters}
                aria-label="Open filters"
              >
                Filters
                {activeFilterCount > 0 ? (
                  <span className="explorer-mobile-count">
                    <AnimatedCount value={activeFilterCount} />
                  </span>
                ) : null}
              </button>

              <button type="button" className="btn btn-secondary" onClick={jumpToResults}>
                Jump to Results
              </button>
            </div>
          </div>

          <div className="hidden gap-4 sm:grid">
            <div className="explorer-filter-group">
              <p className="explorer-filter-label">Track</p>
              <div className="explorer-filter-row explorer-filter-row-wrap">
                {trackOptions.map((option) => {
                  const isActive = resolvedTrackFilter === option.id;
                  const isDisabled = option.id !== "all" && option.count === 0;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => applyTrackFilter(option.id)}
                      disabled={isDisabled}
                      aria-pressed={isActive}
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
              <p className="explorer-filter-label">Focus Areas</p>
              <div className="explorer-filter-row explorer-filter-row-wrap">
                {focusOptions.map((focusArea) => {
                  const isActive = resolvedFocusFilters.includes(focusArea);

                  return (
                    <button
                      key={focusArea}
                      type="button"
                      onClick={() => toggleFocusFilter(focusArea)}
                      aria-pressed={isActive}
                      className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                    >
                      {focusArea}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="explorer-filter-grid">
              <div className="explorer-filter-group">
                <p className="explorer-filter-label">Year</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  <button
                    type="button"
                    onClick={() => applyYearFilter("all")}
                    aria-pressed={resolvedYearFilter === "all"}
                    className={`explorer-filter-pill ${resolvedYearFilter === "all" ? "is-active" : ""}`}
                  >
                    All Years
                  </button>
                  {yearOptions.map((yearOption) => (
                    <button
                      key={yearOption}
                      type="button"
                      onClick={() => applyYearFilter(yearOption)}
                      aria-pressed={resolvedYearFilter === yearOption}
                      className={`explorer-filter-pill ${resolvedYearFilter === yearOption ? "is-active" : ""}`}
                    >
                      {yearOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="explorer-filter-group">
                <p className="explorer-filter-label">Sources</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  {sourceOptions.map((option) => {
                    const isActive = resolvedSourceFilter === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => applySourceFilter(option.id)}
                        aria-pressed={isActive}
                        className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={toggleRepoOnly}
                    aria-pressed={repoOnly}
                    className={`explorer-filter-pill explorer-toggle-pill ${repoOnly ? "is-active" : ""}`}
                  >
                    Has Repo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {hasActiveFilters ? (
              <motion.div
                className="explorer-active-filters"
                role="region"
                aria-label="Active filters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="explorer-filter-label">Active Filters</p>
                <motion.div layout className="explorer-filter-row explorer-filter-row-wrap">
                  <AnimatePresence initial={false}>
                    {normalizedQuery ? (
                      <motion.button
                        key={`chip-search-${normalizedQuery}`}
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => setSearchQuery("")}
                        layout
                        {...chipMotion}
                      >
                        Search: &quot;{searchQuery.trim()}&quot;
                        <X size={12} />
                      </motion.button>
                    ) : null}

                    {resolvedTrackFilter !== "all" ? (
                      <motion.button
                        key={`chip-track-${resolvedTrackFilter}`}
                    type="button"
                    className="explorer-filter-pill is-active"
                    onClick={() => applyTrackFilter("all")}
                        layout
                        {...chipMotion}
                      >
                        Track: {activeTrackLabel}
                        <X size={12} />
                      </motion.button>
                    ) : null}

                    {resolvedFocusFilters.map((focusValue) => (
                      <motion.button
                        key={`chip-focus-${focusValue}`}
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => toggleFocusFilter(focusValue)}
                        layout
                        {...chipMotion}
                      >
                        Focus: {focusValue}
                        <X size={12} />
                      </motion.button>
                    ))}

                    {resolvedYearFilter !== "all" ? (
                      <motion.button
                        key={`chip-year-${resolvedYearFilter}`}
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => applyYearFilter("all")}
                        layout
                        {...chipMotion}
                      >
                        Year: {resolvedYearFilter}
                        <X size={12} />
                      </motion.button>
                    ) : null}

                    {resolvedSourceFilter !== "all" ? (
                      <motion.button
                        key={`chip-source-${resolvedSourceFilter}`}
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => applySourceFilter("all")}
                        layout
                        {...chipMotion}
                      >
                        Source:{" "}
                        {
                          sourceOptions.find((option) => option.id === resolvedSourceFilter)
                            ?.label
                        }
                        <X size={12} />
                      </motion.button>
                    ) : null}

                    {repoOnly ? (
                      <motion.button
                        key="chip-repo-only"
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => {
                          triggerHaptic();
                          setRepoOnly(false);
                        }}
                        layout
                        {...chipMotion}
                      >
                        Has Repo
                        <X size={12} />
                      </motion.button>
                    ) : null}

                    {sortOrder !== "newest" ? (
                      <motion.button
                        key={`chip-sort-${sortOrder}`}
                        type="button"
                        className="explorer-filter-pill is-active"
                        onClick={() => {
                          triggerHaptic();
                          setSortOrder("newest");
                        }}
                        layout
                        {...chipMotion}
                      >
                        Sort: {activeSortLabel}
                        <X size={12} />
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="explorer-summary">
            <p className="text-sm text-[color:var(--text-base)]">
              Showing{" "}
              <span className="font-bold text-[color:var(--text-strong)]">
                <AnimatedCount value={visibleDeckCount} />
              </span>{" "}
              of{" "}
              <span className="font-bold text-[color:var(--text-strong)]">{totalDeckCount}</span> decks
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {isResultsUpdating ? (
                <span className="explorer-updating-pill" role="status" aria-live="polite">
                  Updating results...
                </span>
              ) : null}
              <button type="button" onClick={copyFilteredView} className="btn btn-ghost explorer-reset">
                {linkCopied ? <Check size={15} /> : <Copy size={15} />}
                {linkCopied ? "Copied" : "Copy filtered view"}
              </button>

              {hasActiveFilters ? (
                <button type="button" onClick={resetFilters} className="btn btn-ghost explorer-reset">
                  Reset all
                </button>
              ) : null}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {visibleDeckCount} of {totalDeckCount} decks
          </p>
        </div>
      </section>

      <AnimatePresence>
        {isMobileFilterOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="explorer-sheet-backdrop sm:hidden"
              onClick={() => {
                triggerHaptic();
                setIsMobileFilterOpen(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.section
              className="explorer-sheet sm:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Deck filters"
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: sheetSnap === "full" ? 0 : sheetHalfOffset, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.95 }}
              transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.9 }}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: Math.max(220, sheetHalfOffset + 220) }}
              dragElastic={0.14}
              onDragEnd={handleSheetDragEnd}
            >
              <div
                className="explorer-sheet-handle"
                aria-hidden
                onPointerDown={(event) => dragControls.start(event)}
              />
              <div
                className="explorer-sheet-header"
                onPointerDown={(event) => dragControls.start(event)}
              >
                <h3 className="text-base font-semibold text-[color:var(--text-strong)]">Filters</h3>
                <button
                  type="button"
                  className="explorer-search-clear"
                  onClick={() => {
                    triggerHaptic();
                    setIsMobileFilterOpen(false);
                  }}
                  aria-label="Close filter panel"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="explorer-sheet-content">
              <div className="explorer-filter-group">
                <p className="explorer-filter-label">Track</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  {trackOptions.map((option) => {
                    const isActive = resolvedTrackFilter === option.id;
                    const isDisabled = option.id !== "all" && option.count === 0;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => applyTrackFilter(option.id)}
                        disabled={isDisabled}
                        aria-pressed={isActive}
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
                <p className="explorer-filter-label">Focus Areas</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  {focusOptions.map((focusArea) => {
                    const isActive = resolvedFocusFilters.includes(focusArea);

                    return (
                      <button
                        key={focusArea}
                        type="button"
                        onClick={() => toggleFocusFilter(focusArea)}
                        aria-pressed={isActive}
                        className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                      >
                        {focusArea}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="explorer-filter-group">
                <p className="explorer-filter-label">Year</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  <button
                    type="button"
                    onClick={() => applyYearFilter("all")}
                    aria-pressed={resolvedYearFilter === "all"}
                    className={`explorer-filter-pill ${resolvedYearFilter === "all" ? "is-active" : ""}`}
                  >
                    All Years
                  </button>
                  {yearOptions.map((yearOption) => (
                    <button
                      key={yearOption}
                      type="button"
                      onClick={() => applyYearFilter(yearOption)}
                      aria-pressed={resolvedYearFilter === yearOption}
                      className={`explorer-filter-pill ${resolvedYearFilter === yearOption ? "is-active" : ""}`}
                    >
                      {yearOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="explorer-filter-group">
                <p className="explorer-filter-label">Sources</p>
                <div className="explorer-filter-row explorer-filter-row-wrap">
                  {sourceOptions.map((option) => {
                    const isActive = resolvedSourceFilter === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => applySourceFilter(option.id)}
                        aria-pressed={isActive}
                        className={`explorer-filter-pill ${isActive ? "is-active" : ""}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={toggleRepoOnly}
                    aria-pressed={repoOnly}
                    className={`explorer-filter-pill explorer-toggle-pill ${repoOnly ? "is-active" : ""}`}
                  >
                    Has Repo
                  </button>
                </div>
              </div>
              </div>

              <div className="explorer-sheet-actions">
                <button type="button" className="btn btn-ghost" onClick={resetFilters}>
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    triggerHaptic();
                    setIsMobileFilterOpen(false);
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>

      <div ref={resultsRef} className="explorer-results-anchor" aria-hidden />

      <section className="surface-panel explorer-result-bar p-3 sm:p-4" aria-label="Result actions">
        <div>
          <p className="text-sm font-semibold text-[color:var(--text-strong)]">Review Mode</p>
          <p className="text-xs text-[color:var(--text-muted)]">
            {visibleDeckCount > 0
              ? "Open the top match or share this filtered view with collaborators."
              : "Adjust filters to return matching decks."}
          </p>
        </div>

        <div className="explorer-result-actions">
          {firstVisibleDeck ? (
            <a
              href={firstVisibleDeck.primaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Open Top Match
            </a>
          ) : null}

          <button type="button" className="btn btn-ghost" onClick={copyFilteredView}>
            {linkCopied ? <Check size={15} /> : <Copy size={15} />}
            {linkCopied ? "Copied" : "Copy View Link"}
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resultsKey}
          className="explorer-results-stack"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          aria-busy={isResultsUpdating}
        >
          {isResultsUpdating ? (
            <section className="section-shell overflow-hidden p-5 sm:p-7">
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
          ) : null}

          {visibleDeckCount === 0 ? (
            <section className="section-shell overflow-hidden p-6 sm:p-8">
              <div className="collection-glow collection-glow-amber" aria-hidden />
              <div className="empty-state">
                <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">
                  No decks match these filters
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[color:var(--text-base)]">
                  Try broadening your query, changing focus/year/source filters, or resetting to the default view.
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
                highlightTerms={highlightTerms}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
