import { NextResponse } from 'next/server'
import { getLists } from '@/lib/lists/getLists'

export async function GET() {
  try {
    const lists = await getLists()
    return NextResponse.json({ lists })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
