"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, BookOpen, Phone, MessageSquare } from "lucide-react"

export default function MainNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/emergency", label: "Emergency", icon: Phone },
  ]

  return (
    <nav className="sticky bottom-0 z-10 border-t bg-background">
      <div className="container flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center py-2 ${
                isActive ? "text-red-600" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="mb-1 h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

