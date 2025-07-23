import { NextResponse } from 'next/server'
import { addUserProfile } from '@/lib/user-profile/addUserProfile'

export async function POST() {
  try {
    const profile = await addUserProfile()
    return NextResponse.json({ profile })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
