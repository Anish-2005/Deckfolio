import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deckfolio | Presentation Showcase",
  description:
    "Curated Smart India Hackathon finalist decks and internal presentation archive for recruiters and juries.",
  openGraph: {
    title: "Deckfolio | Presentation Showcase",
    description:
      "Smart India Hackathon finalist decks plus internal institutional presentations in one polished view.",
    url: "https://deckfolio.example.com",
    siteName: "Deckfolio",
    images: [
      {
        url: "/og-deckfolio.png",
        width: 1200,
        height: 630,
        alt: "Deckfolio hero preview",
      },
    ],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
