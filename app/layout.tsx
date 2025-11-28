import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppProvider from "@/components/app-provider"
// Đảm bảo file này tồn tại trong folder components
import { SOSButton } from "@/components/sos-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quick First Aid Guide",
  description: "Emergency first aid instructions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
          {/* Chỉ test mình nút SOS trước */}
          <SOSButton />
        </AppProvider>
      </body>
    </html>
  )
}