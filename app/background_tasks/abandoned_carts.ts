import { prisma } from "../../prisma/prisma.server";
import { getExpiredAbandonedCarts } from "../utils/abandoned_cart";

const CHECK_INTERVAL = 60 * 1000; // Run every 1 minute

async function processAbandonedCarts() {
  try {
    console.log("🔍 Checking for expired abandoned carts...");

    // Fetch expired carts
    const expiredCarts = await getExpiredAbandonedCarts();

    if (expiredCarts.length === 0) {
      console.log("✅ No expired abandoned carts found.");
      return;
    }

    for (const cart of expiredCarts) {
      if (!cart.customer || !cart.customer.phoneNumber) {
        console.warn(`⚠️ Skipping abandoned cart ${cart.id}: No customer phone number.`);
        continue;
      }

      // Build the SMS message
      const smsMessage = "You left something in your cart! Complete your purchase now.";

      console.log(`📤 Triggering SMS API for ${cart.customer.phoneNumber}`);

      // Send SMS via API route
      const response = await fetch(`${process.env.APP_URL}/api/send/sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: smsMessage,
          phoneNumber: cart.customer.phoneNumber,
        }),
      });

      if (!response.ok) {
        console.error(`❌ Failed to send SMS to ${cart.customer.phoneNumber}:`, await response.text());
      } else {
        console.log(`✅ SMS request sent successfully for ${cart.customer.phoneNumber}`);
      }

      // Remove cart after sending SMS
      await prisma.abandonedCart.delete({
        where: { id: cart.id },
      });

      console.log(`🗑️ Removed abandoned cart ${cart.id} from database.`);
    }
  } catch (error) {
    console.error("❌ Error processing abandoned carts:", error);
  }
}

// Run the task at a fixed interval
setInterval(processAbandonedCarts, CHECK_INTERVAL);

console.log("🚀 Abandoned cart background task running...");
