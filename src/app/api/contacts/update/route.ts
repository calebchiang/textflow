import { NextResponse } from 'next/server'
import { updateContact } from '@/lib/contacts/updateContact'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updated = await updateContact(body)
    return NextResponse.json({ contact: updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
