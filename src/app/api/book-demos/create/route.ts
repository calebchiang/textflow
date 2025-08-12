import { NextResponse } from 'next/server'
import { createDemo } from '@/lib/book-demo/createDemo'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const lead = await createDemo(body)
    return NextResponse.json({ lead })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
