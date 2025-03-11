import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleCustomerCreateWebhook } from "../handlers/customers";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📩 Received CUSTOMERS_CREATE webhook for shop: ${shop}`);

    // Call the handler function to add the customer to the database
    const result = await handleCustomerCreateWebhook(shop, payload);

    if (!result.success) {
      return new Response("Failed to process customer", { status: 500 });
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling CUSTOMERS_CREATE webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
