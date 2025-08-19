type TFVInitInput = {
  phoneNumber: string;      
  notificationEmail: string; 
}

type TFVInitOutput = {
  inquiryId: string;
  inquirySessionToken: string;
  registrationId: string;
}

function basicAuthHeader(sid: string, token: string) {
  const creds = Buffer.from(`${sid}:${token}`).toString('base64')
  return `Basic ${creds}`
}

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''

export async function tfvInit(input: TFVInitInput): Promise<TFVInitOutput> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured')
  }

  const params = new URLSearchParams()
  params.set('TollfreePhoneNumber', input.phoneNumber)
  params.set('NotificationEmail', input.notificationEmail)
  const resp = await fetch(
    'https://trusthub.twilio.com/v1/ComplianceInquiries/Tollfree/Initialize',
    {
      method: 'POST',
      headers: {
        Authorization: basicAuthHeader(ACCOUNT_SID, AUTH_TOKEN),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  const json = await resp.json().catch(() => ({} as any))

  if (!resp.ok) {
    const detail =
      json?.message ||
      json?.detail ||
      `Twilio initialize failed with status ${resp.status}`
    const err: any = new Error(detail)
    err.code = json?.code
    err.status = resp.status
    throw err
  }

  const inquiryId = json?.inquiry_id
  const inquirySessionToken = json?.inquiry_session_token
  const registrationId = json?.registration_id

  if (!inquiryId || !inquirySessionToken) {
    throw new Error('Missing inquiry/session token in Twilio response')
  }

  return {
    inquiryId,
    inquirySessionToken,
    registrationId,
  }
}
