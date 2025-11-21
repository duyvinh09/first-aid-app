import { NextResponse } from 'next/server'
import { getAllNotifications, addNotification } from '@/app/api/notifications/data'
import { XMLParser } from 'fast-xml-parser'

async function fetchText(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; fetch-bot/1.0)' } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`)
  return await res.text()
}

function parseRssItems(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
  const parsed = parser.parse(xml)
  const items: { title?: string; link?: string; description?: string }[] = []

  // support both RSS and Atom
  if (parsed.rss && parsed.rss.channel) {
    const channel = parsed.rss.channel
    const list = Array.isArray(channel.item) ? channel.item : [channel.item]
    for (const it of list) {
      if (!it) continue
      items.push({
        title: it.title as string | undefined,
        link: it.link as string | undefined,
        description: (typeof it.description === 'string' ? it.description : undefined) as string | undefined,
      })
    }
  } else if (parsed.feed && parsed.feed.entry) {
    const list = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry]
    for (const it of list) {
      const link = Array.isArray(it.link) ? (it.link[0] && it.link[0]['@_href']) : it.link && it.link['@_href']
      items.push({
        title: it.title as string | undefined,
        link: link as string | undefined,
        description: (it.summary as string | undefined) || (it.content as string | undefined),
      })
    }
  }

  return items
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const sources: string[] = body.sources || [
      'https://vnexpress.net/rss/suc-khoe.rss',
      'https://tuoitre.vn/rss/suc-khoe.rss',
      'https://moh.gov.vn/rss',
    ]

    const existing = getAllNotifications()
    const existingUrls = new Set(existing.map((n) => n.url).filter(Boolean) as string[])

    const created: any[] = []

    for (const src of sources) {
      try {
        const xml = await fetchText(src)
        const items = parseRssItems(xml)
        for (const it of items) {
          if (!it.link) continue
          if (existingUrls.has(it.link)) continue

          const id = `news-${Date.now()}-${Math.floor(Math.random() * 10000)}`
          const item = addNotification({
            id,
            title: it.title || 'Tin mới',
            content: it.description || '',
            isRead: false,
            createdAt: new Date().toISOString(),
            type: 'system',
            url: it.link,
          } as any)
          existingUrls.add(it.link)
          created.push(item)
        }
      } catch (e) {
        // skip source on error
        console.warn('Failed to fetch', src, e)
      }
    }

    return NextResponse.json({ created, count: created.length })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
  }
}
