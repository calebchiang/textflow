import { NextResponse } from 'next/server'
import { addContact } from '@/lib/contacts/addContact'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const contact = await addContact(body)
    return NextResponse.json({ contact })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
