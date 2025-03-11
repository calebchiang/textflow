import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { syncCustomersFromShopify } from "../utils/customers";
import { markSetupComplete } from "app/utils/session";

/**
 * API route to manually sync customers from Shopify Admin API
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate Shopify store
    const { session } = await authenticate.admin(request);
    const storeId = session.shop;
    const accessToken = session.accessToken;

    if (!storeId || !accessToken) {
      return json({ success: false, error: "Unauthorized request" }, { status: 401 });
    }

    // Call utility function to fetch and store customers
    const syncResult = await syncCustomersFromShopify(storeId, accessToken);
    
    if (syncResult.error) {
      return json({ success: false, error: syncResult.error }, { status: 500 });
    }

    await markSetupComplete(storeId);

    return json({ success: true, message: "Customers synced successfully", customersSynced: syncResult.count });
  } catch (error) {
    console.error("Error syncing customers:", error);
    return json({ success: false, error: "Internal server error" }, { status: 500 });
  }
};
