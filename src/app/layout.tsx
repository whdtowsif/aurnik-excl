import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import SessionProvider from "@/components/providers/SessionProvider";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurnik | Premium Handmade Fashion & Organic Boutique",
  description: "Exclusive handmade limited-edition dresses and organic luxury goods from Bangladesh. Experience artisanal craftsmanship with AR try-on technology.",
  keywords: ["Aurnik", "Handmade", "Fashion", "Organic", "Luxury", "Bangladesh", "Jamdani", "Silk", "Artisanal"],
  authors: [{ name: "Aurnik" }],
  icons: {
    icon: "/upload/IMG_9972.png",
  },
  openGraph: {
    title: "Aurnik | Premium Handmade Fashion",
    description: "Artisanal luxury fashion and organic goods from Bangladesh",
    url: "https://aurnik.com",
    siteName: "Aurnik",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurnik | Premium Handmade Fashion",
    description: "Artisanal luxury fashion and organic goods from Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${interSans.variable} ${playfairSerif.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
