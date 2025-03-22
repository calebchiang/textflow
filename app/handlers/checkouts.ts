import { saveAbandonedCart } from "../utils/abandoned_cart";

/**
 * Handles the `checkouts/create` webhook.
 * Saves checkout details in the abandoned carts table.
 */
export async function handleCheckoutsCreateWebhook(shop: string, payload: any) {
  try {
    console.log(`📩 Handling CHECKOUT CREATE webhook for shop: ${shop}`);

    // Extract checkout ID and customer ID (if available)
    const checkoutId = payload.id?.toString();
    const customerId = payload.customer?.id?.toString(); // Nullable for guest users

    if (!checkoutId) {
      console.log("⚠️ Checkout webhook received but no checkout ID found.");
      return { success: false, error: "No checkout ID found in payload" };
    }

    // Save the checkout to the abandoned carts table
    await saveAbandonedCart({
      storeId: shop,
      checkoutId,
      customerId,
    });

    console.log(`✅ Checkout saved as abandoned cart: ${checkoutId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error processing CHECKOUT CREATE webhook:", error);
    return { success: false, error: "Failed to process checkout create webhook" };
  }
}
