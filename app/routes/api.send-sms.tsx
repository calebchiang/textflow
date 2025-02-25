import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { sendSMS } from "../utils/twilio";

/**
 * API route to handle sending SMS messages via Twilio.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    console.log("🟢 Received request to send SMS");

    const { session } = await authenticate.admin(request);
    const storeId = session.shop;

    const formData = await request.formData();
    const message = formData.get("message")?.toString();

    // hard coded for testing
    const phoneNumber = "+17788231022";

    console.log("🟢 Parsed form data:", { phoneNumber, message });

    if (!phoneNumber || !message) {
      console.error("🔴 Missing required fields: phoneNumber or message");
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await sendSMS(phoneNumber, message);

    console.log("🟢 SMS successfully sent to:", phoneNumber);
    return json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("🔴 Twilio API Error:", error);
    return json({ success: false, error: "Failed to send SMS" }, { status: 500 });
  }
};
