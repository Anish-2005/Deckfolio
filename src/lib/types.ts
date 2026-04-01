/* ─────────────────────────────────────────────
   Deckfolio – Canonical Type Definitions
   ───────────────────────────────────────────── */

export type DeckMeta = {
  label: string;
  value: string;
  icon?: string;
};

export type DeckLink = {
  href: string;
  label: string;
};

export type Deck = {
  id: string;
  title: string;
  summary: string;
  badge: string;
  tag: string;
  focusArea: string;
  year: number;
  meta: DeckMeta[];
  primaryLink: DeckLink;
  secondaryLink?: DeckLink;
};

export type DeckCollection = {
  id: string;
  label: string;
  title: string;
  description: string;
  accent: string;
  iconName: string;
  decks: Deck[];
  comingSoon?: boolean;
};

export type HeroStat = {
  label: string;
  value: string;
  suffix?: string;
};
