import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sendSMS } from "../utils/twilio";

/**
 * API route to handle sending SMS messages via Twilio.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    console.log("🟢 Received request to send SMS");

    // Parse JSON request body
    const { phoneNumber, message } = await request.json();

    console.log("🟢 Parsed request:", { phoneNumber, message });

    if (!phoneNumber || !message) {
      console.error("🔴 Missing required fields: phoneNumber or message");
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Send the SMS via Twilio
    await sendSMS(phoneNumber, message);

    console.log("✅ SMS successfully sent to:", phoneNumber);
    return json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("🔴 Twilio API Error:", error);
    return json({ success: false, error: "Failed to send SMS" }, { status: 500 });
  }
};
