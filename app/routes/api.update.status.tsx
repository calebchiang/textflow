import { updateAutomationStatus } from "../utils/automations"; 
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { automationId, status } = await request.json();

    if (!automationId || typeof status !== "boolean") {
      return json({ success: false, error: "Invalid request parameters" }, { status: 400 });
    }

    await updateAutomationStatus(automationId, status);
    return json({ success: true, message: "Automation status updated successfully" });
  } catch (error) {
    console.error("Error updating automation status:", error);
    return json({ success: false, error: "Internal server error" }, { status: 500 });
  }
};
