import { getMatchingOrderConfirmationAutomations, getOrderConfirmationMessage } from "../utils/order_confirmation";

/**
 * Handles the `order/create` webhook.
 */
export async function handleOrderCreateWebhook(shop: string, payload: any) {
  try {
    console.log(`📩 Handling ORDER CREATE webhook for shop: ${shop}`);

    // Extract customer ID from the order payload
    const customerId = payload.customer?.id?.toString(); // Ensure it's a string

    if (!customerId) {
      console.log("⚠️ Order webhook received but no customer ID found.");
      return { success: false, error: "No customer ID found in order payload" };
    }

    // Check if this customer is linked to an order confirmation automation
    const automations = await getMatchingOrderConfirmationAutomations(shop, customerId);

    if (automations.length === 0) {
      console.log(`⚠️ No matching order confirmation automations for customer: ${customerId}`);
      return { success: true };
    }

    // Process each automation (in case multiple automations exist)
    for (const automation of automations) {
      const messageTemplate = await getOrderConfirmationMessage(automation.id);
      const smsMessage = messageTemplate; // Hardcoded for now - dynamic placeholders will be added later

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

    console.log(`✅ Order webhook processed successfully for shop: ${shop}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error processing ORDER CREATE webhook:", error);
    return { success: false, error: "Failed to process order create webhook" };
  }
}
