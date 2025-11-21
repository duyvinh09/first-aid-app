"use client"

import React, { useEffect, useState } from "react"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

type Notification = {
  id: string
  title: string
  content: string
  isRead: boolean
  createdAt: string
  url?: string
}

export default function NotificationDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = async () => {
    setLoading(true)
    try {
      const all = await apiClient.getNotifications()
      const found = (all || []).find((n: any) => n.id === id) || null
      setItem(found)
    } catch (e) {
      setItem(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!item) return <div className="p-6">Notification not found</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
      </div>

      <div className="prose mb-6 text-gray-700">{item.content}</div>

      {item.url && (
        <div className="mb-4">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
            onClick={async () => {
              // mark as read when user opens the external source
              try {
                await apiClient.patchNotification(item.id, { isRead: true })
                await load()
              } catch (e) {}
            }}
          >
            Đọc bài gốc tại nguồn
          </a>
        </div>
      )}

      <div className="flex gap-2">
        {item.isRead ? (
          <button
            className="px-3 py-2 rounded bg-gray-100 text-sm"
            onClick={async () => {
              try {
                await apiClient.patchNotification(item.id, { isRead: false })
                await load()
              } catch (e) {}
            }}
          >
            Mark as unread
          </button>
        ) : (
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
            onClick={async () => {
              try {
                await apiClient.patchNotification(item.id, { isRead: true })
                await load()
              } catch (e) {}
            }}
          >
            Mark as read
          </button>
        )}

        <button className="px-3 py-2 rounded border text-sm" onClick={() => router.back()}>
          Back
        </button>
      </div>
    </div>
  )
}
