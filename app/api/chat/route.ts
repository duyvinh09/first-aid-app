import { NextRequest, NextResponse } from 'next/server'

// Prefer environment variable, but fall back to provided key if not set
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body || {}

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const prompt = message

    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          role: 'system',
          parts: [
            {
              text:
                'You are a helpful, concise medical first-aid assistant. Provide clear, step-by-step, safety-first guidance for common emergencies (CPR, choking, bleeding, burns, fractures, allergic reactions, heatstroke, etc.). Emphasize when to call emergency services. Avoid diagnosing diseases or giving prescriptions. Keep answers suitable for laypeople and include brief cautions when relevant.',
            },
          ],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!geminiResponse.ok) {
      let details: any = undefined
      try {
        details = await geminiResponse.json()
      } catch {
        details = await geminiResponse.text()
      }
      return NextResponse.json({ error: 'Gemini API error', details }, { status: 502 })
    }

    const data = await geminiResponse.json()

    // Extract text from Gemini response safely
    const candidate = data?.candidates?.[0]
    const parts = candidate?.content?.parts || []
    const text = parts.map((p: any) => p?.text).filter(Boolean).join('\n').trim()

    return NextResponse.json({ message: text || 'Sorry, I could not generate a response.' })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}