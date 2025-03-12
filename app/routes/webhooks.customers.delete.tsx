import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleCustomerDeleteWebhook } from "../handlers/customers";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, payload } = await authenticate.webhook(request);

    console.log(`📩 Received CUSTOMERS_DELETE webhook for shop: ${shop}`);

    // Call the handler function to update the customer in the database
    const result = await handleCustomerDeleteWebhook(shop, payload);

    if (!result.success) {
      return new Response("Failed to process customer delete", { status: 500 });
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling CUSTOMERS_DELETE webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
