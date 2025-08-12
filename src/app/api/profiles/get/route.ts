import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/profiles/getProfile'

export async function GET() {
  try {
    const profile = await getProfile()
    return NextResponse.json({ profile })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: err?.message === 'Unauthorized' ? 401 : 400 }
    )
  }
}
