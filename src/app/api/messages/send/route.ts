import { NextResponse } from 'next/server'
import { sendMessage } from '@/lib/messages/sendMessage'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await sendMessage(body)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
