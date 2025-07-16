import { NextResponse } from 'next/server'
import { getContacts } from '@/lib/contacts/getContacts'

export async function GET() {
  try {
    const contacts = await getContacts()
    return NextResponse.json({ contacts })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 401 }
    )
  }
}
