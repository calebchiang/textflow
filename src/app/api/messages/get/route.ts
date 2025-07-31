import { NextResponse } from 'next/server'
import { getMessages } from '@/lib/messages/getMessages'

export async function POST(req: Request) {
  try {
    const { conversationId } = await req.json()

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
    }

    const { messages, userId } = await getMessages(conversationId)

    return NextResponse.json({ messages, userId })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 401 }
    )
  }
}
