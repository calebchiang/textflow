import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleCustomerUpdateWebhook } from "../handlers/customers";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📩 Received CUSTOMERS_UPDATE webhook for shop: ${shop}`);

    // Call the handler function to update the customer in the database
    const result = await handleCustomerUpdateWebhook(shop, payload);

    if (!result.success) {
      return new Response("Failed to process customer update", { status: 500 });
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling CUSTOMERS_UPDATE webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
