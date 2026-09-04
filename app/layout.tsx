import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RateLimitBanner } from "@/components/rate-limit-banner"
import InspectGuard from "@/components/inspect-guard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteLogoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL || "http://localhost:3000/images/crop_scan.webp";

export const metadata: Metadata = {
  title: "LeafLens — Clearer crop care",
  description: "Privacy-first AI crop disease detection with practical treatment plans.",
  keywords: ["LeafLens", "AI crop disease detection", "crop care", "plant disease detection", "agriculture technology"],
  authors: [{ name: "Atharva Mane", url: siteUrl }],
  creator: "Atharva Mane",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      {
        url: "/favicon/favicon-32x32.png",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-16x16.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
  openGraph: {
    title: "LeafLens — Clearer crop care",
    description: "Privacy-first AI crop disease detection with practical treatment plans.",
    url: siteUrl,
    siteName: "LeafLens — Clearer crop care",
    images: [
      {
        url: siteLogoUrl,
        width: 1200,
        height: 630,
        alt: "LeafLens — Clearer crop care",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
        <Footer />
        <RateLimitBanner />
        <Toaster richColors theme="light" position="top-right" />
        <InspectGuard />
      </body>
    </html>
  )
}
