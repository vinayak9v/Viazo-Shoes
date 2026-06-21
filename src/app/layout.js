import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Complete SEO & Metadata Configuration
export const metadata = {
  title: {
    default: "Viazo | Premium Sneakers & Streetwear",
    template: "%s | Viazo" // Ye baaki pages par kaam aayega jaise "Shop | Viazo"
  },
  description: "Viazo is a lifestyle brand crafted for those who move with confidence and express themselves fearlessly. Explore our premium collection of sneakers.",
  keywords: ["sneakers", "premium shoes", "streetwear", "Viazo", "running shoes", "lifestyle sneakers", "buy sneakers online"],
  authors: [{ name: "Viazo Team" }],
  creator: "Viazo",
  
  // Open Graph (For Facebook, WhatsApp, LinkedIn link previews)
  openGraph: {
    type: "website",
    locale: "en_IN", // Indian English locale
    url: "https://www.viazo.com", // Apni actual domain yahan dalein
    title: "Viazo | Move Bold. Live Fearless.",
    description: "Step into premium comfort with Viazo. Explore our exclusive sneaker collections today.",
    siteName: "Viazo",
    images: [
      {
        url: "/og-image.jpg", // Public folder mein ek 1200x630 ki image daal dein
        width: 1200,
        height: 630,
        alt: "Viazo Premium Sneakers",
      },
    ],
  },
  
  // Twitter Card (For Twitter/X link previews)
  twitter: {
    card: "summary_large_image",
    title: "Viazo | Premium Sneakers",
    description: "Move Bold. Live Fearless. Explore the new collection by Viazo.",
    images: ["/og-image.jpg"],
  },
  
  // Apple Web App styling
  appleWebApp: {
    title: "Viazo",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}