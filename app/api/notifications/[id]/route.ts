import { NextResponse } from 'next/server'
import { updateNotification, getAllNotifications } from '../data'

export async function PATCH(request: Request, context: any) {
  const { params } = await context
  const id = params.id
  try {
    const body = await request.json()
    const updated = updateNotification(id, body)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
