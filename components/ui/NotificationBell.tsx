"use client"

import React, { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function NotificationBell() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const notifications = useAppStore((s) => s.notifications)
  const fetchNotifications = useAppStore((s) => s.fetchNotifications)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // for demo: add a mock notification via API
  const addDemoNotification = async () => {
    try {
      await apiClient.postNotification({
        title: "New system update",
        content: "Your app has a critical update available.",
        type: 'system',
      })
      await fetchNotifications()
    } catch (e) {
      // ignore
    }
  }

  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 bottom-full mb-2 w-80 z-50 origin-bottom-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5">
            <div className="px-4 py-3 border-b border-gray-100 font-semibold flex items-center justify-between">
              <span>Thông báo</span>
              <button onClick={addDemoNotification} className="text-xs text-gray-500 hover:underline">Add</button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {sorted.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No notifications</div>
              )}

              {sorted.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border-b cursor-pointer flex items-start gap-3 ${!item.isRead ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    // navigate to the notification detail page
                    router.push(`/notifications/${item.id}`)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.content}</p>
                    {item.url && (
                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            try {
                              // open external source in a new tab
                              window.open(item.url, "_blank", "noopener,noreferrer")
                            } catch (err) {
                              // ignore
                            }
                          }}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Đọc nguồn gốc
                        </button>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      {!item.isRead ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            try {
                              await apiClient.patchNotification(item.id, { isRead: true })
                              await fetchNotifications()
                            } catch (e) {}
                          }}
                          className="text-xs text-blue-600"
                        >
                          Mark as read
                        </button>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            try {
                              await apiClient.patchNotification(item.id, { isRead: false })
                              await fetchNotifications()
                            } catch (e) {}
                          }}
                          className="text-xs text-gray-600"
                        >
                          Mark as unread
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
