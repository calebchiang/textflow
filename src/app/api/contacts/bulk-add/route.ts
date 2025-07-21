import { NextResponse } from 'next/server'
import { addBulkContacts } from '@/lib/contacts/addBulkContacts'

export async function POST(req: Request) {
  try {
    const { contacts, list_id } = await req.json()

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts provided' }, { status: 400 })
    }

    if (!list_id) {
      return NextResponse.json({ error: 'Missing list ID' }, { status: 400 })
    }

    const result = await addBulkContacts(contacts, list_id)

    return NextResponse.json({ contacts: result }) 
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
