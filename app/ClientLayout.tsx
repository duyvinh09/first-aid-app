"use client";
import GTranslateWidget from "@/components/GTranslateWidget";
import AppProvider from "@/components/app-provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      <GTranslateWidget />
      <AppProvider>
        {children}
      </AppProvider>
    </div>
  );
}
