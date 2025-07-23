import { NextResponse } from 'next/server'
import { updateUserProfile } from '@/lib/user-profile/updateUserProfile'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updated = await updateUserProfile(body)
    return NextResponse.json({ success: true, updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
