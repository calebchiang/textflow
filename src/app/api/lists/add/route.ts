import { NextResponse } from 'next/server'
import { addList } from '@/lib/lists/addList'

export async function POST(req: Request) {
  try {
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Missing list name' }, { status: 400 })
    }

    const list = await addList(name)
    return NextResponse.json({ list })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
