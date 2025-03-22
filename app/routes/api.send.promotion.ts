import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { handleSendPromotion } from "../handlers/promotions";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { automationId } = await request.json();
    const { session } = await authenticate.admin(request);

    if (!automationId || !session?.shop) {
      return json({ success: false, error: "Missing automation ID or shop session" }, { status: 400 });
    }

    const result = await handleSendPromotion(session.shop, automationId);

    return json(result);
  } catch (error) {
    return json({ success: false, error: "Internal server error" }, { status: 500 });
  }
};
