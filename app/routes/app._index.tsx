import { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { EVENT_TEMPLATES } from "../constants/events";
import { createAutomation } from "../utils/automations"; 
import DashboardCard from "../components/DashboardCard";
import AutomationModal from "../components/AutomationModal";

/**
 * authenticates shopify admin user before rendering the page
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

/**
 * Receives form submission data from frontend, calls createAutomation() util function
 */
export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const storeId = session.shop;
    const formData = await request.formData();

    const event = formData.get("event")?.toString();
    const message = formData.get("message")?.toString();
    const status = formData.get("status") === "true";
    const delayMinutes = formData.get("delayMinutes") ? Number(formData.get("delayMinutes")) : 0;
    const recipients = JSON.parse(formData.get("recipients") || "[]");

    if (!storeId || !event || !message) {
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const automation = await createAutomation({
      storeId,
      event,
      message,
      status,
      delayMinutes,
      recipients,
    });

    return json({ success: true, automation });
  } catch (error) {
    console.error("Failed to save automation:", error);
    return json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * main UI component
 */
export default function Dashboard() {
  const [modalActive, setModalActive] = useState(false);
  const [event, setEvent] = useState("abandoned_cart");
  const [message, setMessage] = useState(EVENT_TEMPLATES["abandoned_cart"]);
  const [status, setStatus] = useState(true);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);

  const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <DashboardCard onOpenModal={handleModalChange} />
        </Layout.Section>
      </Layout>

      <AutomationModal
        modalActive={modalActive}
        handleModalChange={handleModalChange}
        event={event}
        setEvent={setEvent}
        message={message}
        setMessage={setMessage}
        status={status}
        setStatus={setStatus}
        delayMinutes={delayMinutes}
        setDelayMinutes={setDelayMinutes}
        recipients={recipients}
      />
    </Page>
  );
}
