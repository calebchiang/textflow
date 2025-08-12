import { NextResponse } from 'next/server'
import { createConversation } from '@/lib/conversations/createConversation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await createConversation(body)
    return NextResponse.json(result)
  } catch (err: any) {
    const code = err?.code || null
    const message = err?.message || 'Something went wrong'

    return NextResponse.json(
      { error: code || message }, 
      { status: 400 }
    )
  }
}
