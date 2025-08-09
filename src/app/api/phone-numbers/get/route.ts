import { NextResponse } from 'next/server'
import { getPhoneNumber } from '@/lib/phone_numbers/getPhoneNumber'

export async function GET() {
  try {
    const phoneNumber = await getPhoneNumber()
    return NextResponse.json({ phoneNumber })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 401 }
    )
  }
}
