import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import ErrorBoundary from "@/components/ErrorBoundary";
import { validateEnv } from "@/utils/env";

// Validate environment variables at build/runtime
if (typeof window === "undefined") {
  validateEnv();
}

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Logor",
  "alternateName": "Logor Business Solutions",
  "url": "https://logorbusiness.pages.dev/",
  "logo": "https://logorbusiness.pages.dev/logor-logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7305313682",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi", "Tamil"],
    "areaServed": "IN"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Puducherry",
    "addressCountry": "IN"
  },
  "description": "We help local businesses in India become digital in one day through NFC business cards, custom QR codes, Google Business optimization, and smart customer engagement.",
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "INR",
    "description": "Starter Plan - Premium NFC Business Card + Digital Profile"
  },
  "sameAs": [
    "https://wa.me/917305313682",
    "https://t.me/logorcrmbot"
  ]
};

export const metadata: Metadata = {
  title: "Logor | One Tap. Unlimited Business Opportunities.",
  description: "We help local businesses in India become digital in one day through NFC business cards, custom QR codes, Google Business optimization, and smart customer engagement.",
  keywords: "NFC business cards, local business digital transformation, Google Reviews India, QR Code menus, WhatsApp Business Puducherry, local SEO, Logor",
  openGraph: {
    title: "Logor | One Tap. Unlimited Business Opportunities.",
    description: "Become digital in 24 hours with NFC business cards + Google Review Booster + custom landing pages.",
    url: "https://logorbusiness.pages.dev/",
    siteName: "Logor",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://logorbusiness.pages.dev/logor-logo.png",
        width: 1200,
        height: 630,
        alt: "Logor - Digital Transformation for Local Businesses"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Logor | Digital in 24 Hours",
    description: "NFC business cards + Google Review Booster + custom landing pages for Indian local businesses."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://logorbusiness.pages.dev/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth h-full antialiased`}
    >
      <body className="font-sans min-h-full bg-charcoal text-white selection:bg-orange-500 selection:text-white flex flex-col">
        <CursorGlow />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
