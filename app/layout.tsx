import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/app-provider";
import GTranslateWidget from "@/components/GTranslateWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick First Aid Guide",
  description: "Emergency first aid instructions at your fingertips",
  generator: "@duyvinh09",
  authors: [{ name: "Quick First Aid Team" }],
  icons: {
    icon: [
      { url: "icons/favicon.ico", type: "image/x-icon" },
      { url: "icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    locale: "vi_VN",
  },
  themeColor: "#ffffff",
  manifest: "/icons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Leaflet CSS for maps */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* EmailJS SDK */}
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if (window.emailjs && !window.__emailjs_initialized__) {
                  window.emailjs.init({ publicKey: '${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY}' });
                  window.__emailjs_initialized__ = true;
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <GTranslateWidget />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
