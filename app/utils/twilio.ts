import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

export async function sendSMS(to: string, message: string): Promise<void> {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER as string,
      to,
    });
    console.log("SMS sent successfully:", response.sid);
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw new Error("Failed to send SMS");
  }
}
