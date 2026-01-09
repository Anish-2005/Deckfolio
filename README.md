## Deckfolio (Next.js + Tailwind)

Deckfolio is a recruiter-ready showcase for two Smart India Hackathon finalist decks and two internal decks, powered by Next.js 14 (App Router), TypeScript, and Tailwind CSS v4.

## Development

```bash
npm install          # first-time setup
npm run dev          # start local server on http://localhost:3000
npm run lint         # lint with ESLint
npm run build        # production build
```

## Content Model

- `src/app/page.tsx` holds the `deckCollections` data structure. Each entry includes:
	- `label`, `title`, `description`, and `accent` for the section
	- `decks[]` with badges, summary, metadata, and button links
- The "Non-SIH Presentation Decks" collection ships empty with a "Coming Soon" card as a placeholder for future work.
- `src/app/globals.css` contains brand colors, gradients, and typography adjustments.
- Light/dark theming is powered by [`next-themes`](https://github.com/pacocoursey/next-themes). The toggle lives in `src/components/theme-toggle.tsx`, and the CSS variables that drive both palettes are defined in `globals.css`.

To add another presentation, duplicate a deck object inside the relevant collection or create a new collection block if you need a fresh category (e.g., "Startup Pitch Decks").

## Deployment

Deploy to any static-friendly host:

1. `npm run build`
2. `npm run start` locally to verify
3. Push to GitHub and connect to Vercel/Netlify, or use `vercel --prod`

## Assets

- Place your PPT/PDF exports or summary links inside `public/decks/` (or update the `href` fields to point to external storage). Update the `mailto:` CTA in `page.tsx` with your preferred inbox.
- Replace `public/deckfolio.svg` with your official Deckfolio logo asset (PNG/SVG). The nav, footer, and metadata icons all reference this file, so keeping the path consistent will update branding everywhere automatically.
