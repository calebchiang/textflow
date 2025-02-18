import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { createAutomation, getAutomationsForStore, editAutomation, deleteAutomation } from "../utils/automations";
import Dashboard from "../components/Dashboard";

/**
 * Authenticates Shopify admin user before rendering the page.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const storeId = session.shop;
  const automations = await getAutomationsForStore(storeId);
  return json({ automations });
};

/**
 * Handles automation creation, update, and deletion.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const storeId = session.shop;
    const formData = await request.formData();
    const method = request.method;

    const automationId = formData.get("automationId")?.toString();

    if (method === "DELETE") {
      if (!automationId) {
        return json({ success: false, error: "Missing automation ID" }, { status: 400 });
      }
      await deleteAutomation(automationId);
      return json({ success: true });
    }

    const name = formData.get("name")?.toString();
    const event = formData.get("event")?.toString();
    const message = formData.get("message")?.toString();
    const delayMinutes = formData.get("delayMinutes") ? Number(formData.get("delayMinutes")) : 0;
    const rawRecipients = formData.get("recipients");
    const recipients = rawRecipients ? JSON.parse(rawRecipients.toString()) : [];

    if (!storeId || !event || !message || !name) {
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let automation;
    if (method.toUpperCase() === "PUT" && automationId) {
      automation = await editAutomation({
        automationId,
        storeId,
        name,
        event,
        message,
        delayMinutes,
        recipients,
      });
    } else {
      automation = await createAutomation({
        storeId,
        name,
        event,
        message,
        status: false,
        delayMinutes,
        recipients,
      });
    }

    return json({ success: true, automation });
  } catch (error) {
    console.error("Failed to process automation:", error);
    return json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * Main page component that renders the Dashboard.
 */
export default function Index() {
  const automations = useLoaderData<typeof loader>().automations;
  return <Dashboard automations={automations} />;
}
