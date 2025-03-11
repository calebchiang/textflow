import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getCustomersForStore } from "../utils/customers";

/**
 * API route to fetch all customers from the database linked to a store.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const storeId = session.shop;

    if (!storeId) {
      return json({ success: false, error: "Unauthorized request" }, { status: 401 });
    }

    const customers = await getCustomersForStore(storeId);
    return json({ success: true, customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return json({ success: false, error: "Internal server error" }, { status: 500 });
  }
};
