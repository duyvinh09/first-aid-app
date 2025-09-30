"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center p-6 relative">
      <h1 className="text-3xl font-bold mb-8 text-red-600 text-center drop-shadow-md">
        Admin Dashboard
      </h1>

      <p className="mb-8 text-gray-700 text-center max-w-md">
        Manage guides for the emergency system. You can upload new guides or edit existing ones.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/upload"
          className="rounded-xl border p-6 hover:shadow-xl hover:border-red-300 transition-all bg-white flex flex-col items-center justify-center w-64 h-40 text-center"
        >
          <h2 className="text-xl font-semibold text-red-600 mb-2">Upload Guide</h2>
          <p className="text-sm text-gray-600">
            Add new first aid guides to the system.
          </p>
        </Link>

        <Link
          href="/admin/guides"
          className="rounded-xl border p-6 hover:shadow-xl hover:border-red-300 transition-all bg-white flex flex-col items-center justify-center w-64 h-40 text-center"
        >
          <h2 className="text-xl font-semibold text-red-600 mb-2">Manage Guides</h2>
          <p className="text-sm text-gray-600">
            View, edit, or delete existing guides.
          </p>
        </Link>
      </div>

      {/* Optional decoration */}
      <div className="mt-16 flex flex-col items-center space-y-4">
        <div className="flex space-x-3">
          <div className="w-3 h-3 bg-red-200 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse delay-200"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-400"></div>
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-black font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
