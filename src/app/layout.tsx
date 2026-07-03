import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/components/shared/favorites-provider";
import { AnalyticsBeacon } from "@/components/shared/analytics-beacon";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = "LUMA — Curated Stays, Extraordinary Moments";
const SITE_DESCRIPTION =
  "LUMA is a curated luxury stays brand offering handpicked homes in the world's most exceptional locations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | LUMA" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "LUMA",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "A LUMA villa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider delay={200}>
          <FavoritesProvider>{children}</FavoritesProvider>
        </TooltipProvider>
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
