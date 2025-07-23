import { NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/user-profile/getUserProfile'

export async function GET() {
  try {
    const profile = await getUserProfile()
    return NextResponse.json({ profile })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
