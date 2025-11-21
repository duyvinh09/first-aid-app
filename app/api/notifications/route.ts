// Simple in-memory notifications API (dev/demo only)
import { NextResponse } from 'next/server'
import { getAllNotifications, addNotification } from './data'

export async function GET() {
  const sorted = getAllNotifications().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json(sorted)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = `n-${Date.now()}`
    const item = addNotification({
      id,
      title: body.title || 'Notification',
      content: body.content || '',
      isRead: false,
      createdAt: new Date().toISOString(),
      type: body.type || 'system',
    })
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
