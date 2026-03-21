import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RoomVision — Transformez vos espaces avec l'IA",
  description:
    "De la photo au rendu réaliste en quelques secondes. Uploadez une photo de pièce, ajoutez un moodboard, et laissez l'IA générer des visualisations époustouflantes pour vos projets de design d'intérieur.",
  keywords: [
    "design intérieur",
    "IA",
    "visualisation",
    "rendu réaliste",
    "moodboard",
    "architecture",
    "décoration",
    "intelligence artificielle",
  ],
  openGraph: {
    title: "RoomVision — Transformez vos espaces avec l'IA",
    description:
      "De la photo au rendu réaliste en quelques secondes. Générez des visualisations époustouflantes avec l'IA.",
    type: "website",
    locale: "fr_FR",
    siteName: "RoomVision",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomVision — Transformez vos espaces avec l'IA",
    description:
      "De la photo au rendu réaliste en quelques secondes. Générez des visualisations époustouflantes avec l'IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
