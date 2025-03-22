import { getMatchingReviewRequestAutomations, getReviewRequestMessage } from "../utils/review_request";

/**
 * Handles the `fulfillment/update` webhook.
 */
export async function handleFulfillmentUpdateWebhook(shop: string, payload: any) {
  try {
    console.log(`📦 Handling FULFILLMENT UPDATE webhook for shop: ${shop}`);

    // Extract fulfillment details
    const customerId = payload.order_id?.toString();
    const shipmentStatus = payload.shipment_status; // Possible values: "pending", "in_transit", "delivered", etc.

    console.log(`📦 Shipment Status: ${shipmentStatus}`);

    if (!customerId) {
      console.log("⚠️ Fulfillment webhook received but no order ID found.");
      return { success: false, error: "No order ID found in fulfillment payload" };
    }

    // Only proceed if shipment status is marked as "delivered"
    if (shipmentStatus !== "delivered") {
      console.log(`🚫 Shipment status is not 'delivered'. No review request triggered.`);
      return { success: true };
    }

    // Fetch matching review request automations
    const automations = await getMatchingReviewRequestAutomations(shop, customerId);

    if (automations.length === 0) {
      console.log(`⚠️ No matching review request automations for order: ${customerId}`);
      return { success: true };
    }

    // Process each automation (in case multiple automations exist)
    for (const automation of automations) {
      const messageTemplate = await getReviewRequestMessage(automation.id);
      const smsMessage = messageTemplate; // Dynamic placeholders can be added later

      // Send SMS via API route instead of calling Twilio directly
      for (const recipient of automation.recipients) {
        if (recipient.customer.phoneNumber) {
          console.log(`📤 Triggering SMS API for ${recipient.customer.phoneNumber}`);

          const response = await fetch(`${process.env.APP_URL}/api/send/sms`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: smsMessage,
              phoneNumber: recipient.customer.phoneNumber,
            }),
          });

          if (!response.ok) {
            console.error(`❌ Failed to send SMS to ${recipient.customer.phoneNumber}:`, await response.text());
          } else {
            console.log(`✅ SMS request sent successfully for ${recipient.customer.phoneNumber}`);
          }
        }
      }
    }

    console.log(`✅ Fulfillment webhook processed successfully for shop: ${shop}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error processing FULFILLMENT UPDATE webhook:", error);
    return { success: false, error: "Failed to process fulfillment update webhook" };
  }
}
