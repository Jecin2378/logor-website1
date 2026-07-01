import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logor | One Tap. Unlimited Business Opportunities.",
  description: "We help local businesses in India become digital in one day through NFC business cards, custom QR codes, Google Business optimization, and smart customer engagement.",
  keywords: "NFC business cards, local business digital transformation, Google Reviews India, QR Code menus, WhatsApp Business Puducherry, local SEO, Logor",
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
        {children}
      </body>
    </html>
  );
}
