import { NextResponse } from 'next/server'
import { getConversations } from '@/lib/conversations/getConversations'

export async function GET() {
  try {
    const conversations = await getConversations()
    return NextResponse.json({ conversations })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 401 }
    )
  }
}
