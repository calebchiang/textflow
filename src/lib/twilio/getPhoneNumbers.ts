import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!

const client = twilio(accountSid, authToken)

export async function getAvailablePhoneNumbers() {
  try {
    const searchOptions: any = {
      smsEnabled: true,
      limit: 10,
    }

    const numbers = await client
      .availablePhoneNumbers('US') 
      .tollFree
      .list(searchOptions)

    return numbers.map((n) => ({
      phoneNumber: n.phoneNumber,
      friendlyName: n.friendlyName,
    }))
  } catch (err) {
    console.error('Error fetching toll-free phone numbers:', err)
    throw err
  }
}
