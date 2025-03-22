import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleFulfillmentUpdateWebhook } from "../handlers/fulfillments"; 

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate webhook and get the shop + payload
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📦 Received FULFILLMENT UPDATE webhook for shop: ${shop}`);

    // Call the handler function to process the fulfillment update
    await handleFulfillmentUpdateWebhook(shop, payload);

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling FULFILLMENT UPDATE webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
