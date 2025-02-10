import { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { EVENT_TEMPLATES } from "../constants/events";
import { createAutomation, getAutomationsForStore } from "../utils/automations";
import DashboardCard from "../components/DashboardCard";
import AutomationModal from "../components/AutomationModal";
import EventSelectionModal from "../components/EventSelectionModal";

/**
 * authenticates shopify admin user before rendering the page
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const storeId = session.shop;
  const automations = await getAutomationsForStore(storeId);

  return json({ automations });
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
    const status = formData.get("status") === "false";
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
  const automations = useLoaderData<typeof loader>().automations;
  const [eventSelectionModalActive, setEventSelectionModalActive] = useState(false);
  const [automationModalActive, setAutomationModalActive] = useState(false);
  const [event, setEvent] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);

  const handleOpenEventSelectionModal = () => setEventSelectionModalActive(true);
  const handleCloseEventSelectionModal = () => setEventSelectionModalActive(false);

  const handleOpenAutomationModal = (selectedEvent: string) => {
    setEvent(selectedEvent);
    setMessage(EVENT_TEMPLATES[selectedEvent] || "");
    setEventSelectionModalActive(false);
    setAutomationModalActive(true);
  };

  const handleCloseAutomationModal = () => setAutomationModalActive(false);

  return (
    <Page>
      <Layout>
        <Layout.Section>
        <DashboardCard onOpenModal={handleOpenEventSelectionModal} automations={automations} />

        </Layout.Section>
      </Layout>

      <EventSelectionModal
        modalActive={eventSelectionModalActive}
        handleClose={handleCloseEventSelectionModal}
        handleContinue={handleOpenAutomationModal}
      />

      <AutomationModal
        modalActive={automationModalActive}
        handleModalChange={handleCloseAutomationModal}
        event={event ?? ""}
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
