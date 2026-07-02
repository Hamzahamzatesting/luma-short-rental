import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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

export const metadata: Metadata = {
  title: "LUMA — Curated Stays, Extraordinary Moments",
  description:
    "LUMA is a curated luxury stays brand offering handpicked homes in the world's most exceptional locations.",
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
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
