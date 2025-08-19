import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tfvInit } from '@/lib/tfv/tfvInit'

type InitBody = {
  phone_id?: string;            
  notification_email?: string; 
}

const TOLL_FREE_REGEX = /^\+1(800|888|877|866|855|844|833)\d{7}$/

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as InitBody
    let q = supabase
      .from('phone_numbers')
      .select('id, number, twilio_phone_sid, country, status')
      .eq('user_id', user.id)

    if (body.phone_id) q = q.eq('id', body.phone_id)

    const { data: numbers, error: numbersErr } = await q.limit(5)

    if (numbersErr) {
      return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 400 })
    }
    if (!numbers || numbers.length === 0) {
      return NextResponse.json({ error: 'No phone number found for this user' }, { status: 404 })
    }

    const selected =
      numbers.find(n => (body.phone_id ? n.id === body.phone_id : true)) ||
      numbers[0]

    const phoneNumber: string = selected.number

    if (!TOLL_FREE_REGEX.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Selected number is not a valid NANP toll-free (+1 800/888/877/866/855/844/833)' },
        { status: 400 }
      )
    }

    const notificationEmail = body.notification_email || user.email
    if (!notificationEmail) {
      return NextResponse.json(
        { error: 'Missing notification email (no user email on file)' },
        { status: 400 }
      )
    }

    const initRes = await tfvInit({
      phoneNumber,
      notificationEmail,
    })

    const { data: existing, error: existingErr } = await supabase
      .from('toll_free_verifications')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!existingErr && existing) {
      const { error: updateErr } = await supabase
        .from('toll_free_verifications')
        .update({
          phone_number_id: selected.id,
          phone_number_e164: phoneNumber,
          inquiry_id: initRes.inquiryId,
          registration_id: initRes.registrationId,
          notification_email: notificationEmail,
          status: 'initialized',
        })
        .eq('id', existing.id)

      if (updateErr) {
        return NextResponse.json({ error: 'Failed to persist verification record' }, { status: 400 })
      }
    } else {
      const { error: insertErr } = await supabase
        .from('toll_free_verifications')
        .insert({
          user_id: user.id,
          phone_number_id: selected.id,
          phone_number_e164: phoneNumber,
          inquiry_id: initRes.inquiryId,
          registration_id: initRes.registrationId,
          notification_email: notificationEmail,
          status: 'initialized',
        })

      if (insertErr) {
        return NextResponse.json({ error: 'Failed to persist verification record' }, { status: 400 })
      }
    }

    return NextResponse.json({
      inquiry_id: initRes.inquiryId,
      inquiry_session_token: initRes.inquirySessionToken,
      registration_id: initRes.registrationId,
      phone_number: phoneNumber,
    })
  } catch (err: any) {
    const message =
      err?.detail ||
      err?.message ||
      'Failed to initialize Toll-Free Verification'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
