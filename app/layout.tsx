import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppProvider from "@/components/app-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quick First Aid Guide",
  description: "Emergency first aid instructions at your fingertips",
    generator: 'v0.app'
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
        </AppProvider>
      </body>
    </html>
  )
}

