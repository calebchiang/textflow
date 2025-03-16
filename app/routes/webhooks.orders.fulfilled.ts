import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleOrderFulfilledWebhook } from "../handlers/orders"; 

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate webhook and get the shop + payload
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📦 Received ORDERS_FULFILLED webhook for shop: ${shop}`);

    // Call the handler function to process the fulfillment
    await handleOrderFulfilledWebhook(shop, payload);

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling ORDERS_FULFILLED webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
