import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Yoga for Cure by Neha — Online Indian Yoga Teacher",
  description:
    "Stop thinking. Start practicing. Live online yoga classes and self-paced courses with an experienced Indian yoga teacher, taught in clear English for strength, flexibility, and lasting wellbeing.",
  keywords: [
    "online yoga classes",
    "Indian yoga teacher",
    "live yoga classes online",
    "yoga for sleep",
    "yoga for stress relief",
    "yoga for beginners online",
    "corporate wellness yoga",
    "Yoga for Cure",
    "Yoga by Neha",
  ],
  authors: [{ name: "Neha", url: baseUrl }],
  creator: "Yoga for Cure",
  publisher: "Yoga for Cure",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Yoga for Cure",
    title: "Yoga for Cure by Neha — Online Indian Yoga Teacher",
    description:
      "Live online yoga classes and self-paced courses for strength, flexibility, and lasting wellbeing, taught in clear English from anywhere in the world.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoga for Cure by Neha — Online Indian Yoga Teacher",
    description:
      "Live online yoga classes and self-paced courses for strength, flexibility, and lasting wellbeing.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3a1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/gallery_yoga/yogachar.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
