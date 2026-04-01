import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#080b12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Deckfolio - Presentation Showcase",
  description:
    "Curated Smart India Hackathon finalist decks and internal presentation archive for recruiters, juries, and faculty reviews.",
  keywords: [
    "Deckfolio",
    "presentation portfolio",
    "Smart India Hackathon",
    "SIH decks",
    "project showcase",
    "pitch deck",
  ],
  authors: [{ name: "Anish" }],
  creator: "Anish",
  icons: {
    icon: "/deckfolio.png",
    shortcut: "/deckfolio.png",
    apple: "/deckfolio.png",
  },
  openGraph: {
    title: "Deckfolio - Presentation Showcase",
    description:
      "Smart India Hackathon finalist decks plus internal institutional presentations in one polished view.",
    url: "https://deckfolio.example.com",
    siteName: "Deckfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-deckfolio.png",
        width: 1200,
        height: 630,
        alt: "Deckfolio - Presentation Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deckfolio - Presentation Showcase",
    description:
      "Curated SIH finalist decks and internal innovations in one recruiter-ready portfolio.",
    images: ["/og-deckfolio.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL("https://deckfolio.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${plexMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
