import { getPromotionMessage, getPromotionAutomationById } from "../utils/send_promotion";

/**
 * Handles manually triggered limited-time promotion automations.
 */
export async function handleSendPromotion(shop: string, automationId: string) {
  try {
    console.log(`📢 Handling SEND LIMITED TIME PROMOTION for shop: ${shop}`);
    console.log(`🔍 Looking up automation with ID: ${automationId}`);

    // Fetch the automation and its recipients
    const automation = await getPromotionAutomationById(automationId);

    if (!automation || automation.storeId !== shop || !automation.status) {
      console.warn(`⚠️ No matching automation found for ID: ${automationId}`);
      return { success: false, error: "Automation not found or inactive" };
    }

    const messageTemplate = await getPromotionMessage(automationId);
    const smsMessage = messageTemplate;

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

    console.log(`✅ Promotion SMS sent successfully for automation: ${automationId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error processing promotion send:", error);
    return { success: false, error: "Failed to send promotion SMS" };
  }
}
