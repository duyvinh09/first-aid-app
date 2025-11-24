import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppProvider from "@/components/app-provider"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quick First Aid Guide",
  description: "Emergency first aid instructions at your fingertips",
    generator: '@duyvinh09',
    authors: [{ name: 'Quick First Aid Team' }],
    icons: {
      icon: [
        { url: 'icons/favicon.ico', type: 'image/x-icon' },
        { url: 'icons/favicon.svg', type: 'image/svg+xml' },
        { url: '/icons/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      ],
      shortcut: '/icons/favicon.ico',
      apple: '/icons/apple-touch-icon.png',
    },
    openGraph: {
      locale: 'vi_VN',
    },
    themeColor: '#ffffff',
    manifest: '/icons/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
      </head>
      <body className={inter.className}>
        
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

  