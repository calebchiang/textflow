import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleCheckoutsCreateWebhook } from "../handlers/checkouts";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate the webhook and extract shop + payload
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📩 Received CHECKOUT CREATE webhook for shop: ${shop}`);

    // Call the handler function to save the checkout in the abandoned carts table
    await handleCheckoutsCreateWebhook(shop, payload);

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling CHECKOUT CREATE webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
