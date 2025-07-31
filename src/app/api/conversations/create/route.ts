import { NextResponse } from 'next/server'
import { createConversation } from '@/lib/conversations/createConversation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await createConversation(body)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
