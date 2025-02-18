import { useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { EVENT_TEMPLATES } from "../constants/events";
import { createAutomation, getAutomationsForStore, editAutomation } from "../utils/automations";
import DashboardCard from "../components/DashboardCard";
import AutomationModal from "../components/AutomationModal";
import EventSelectionModal from "../components/EventSelectionModal";
import type { ActionFunctionArgs } from "@remix-run/node";

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
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const storeId = session.shop;
    const formData = await request.formData();

    const automationId = formData.get("automationId")?.toString(); // ✅ Get automationId

    const event = formData.get("event")?.toString();
    const message = formData.get("message")?.toString();
    const delayMinutes = formData.get("delayMinutes") ? Number(formData.get("delayMinutes")) : 0;
    const rawRecipients = formData.get("recipients");
    const recipients = rawRecipients ? JSON.parse(rawRecipients.toString()) : [];

    if (!storeId || !event || !message) {
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let automation;
    if (request.method.toUpperCase() === "PUT" && automationId) {
      // Editing existing automation
      automation = await editAutomation({
        automationId,
        storeId,
        event,
        message,
        delayMinutes,
        recipients,
      });
    } else {
      // Creating new automation
      automation = await createAutomation({
        storeId,
        event,
        message,
        status: false,
        delayMinutes,
        recipients,
      });
    }

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

  const [selectedAutomation, setSelectedAutomation] = useState<any | null>(null); 
  const [message, setMessage] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);

  const handleCloseEventSelectionModal = () => setEventSelectionModalActive(false);
  const handleOpenAutomationModal = (selectedEventOrAutomation?: string | any) => {  
    if (!selectedEventOrAutomation) {
      setSelectedAutomation(null);
      setEvent(null);
      setMessage("");
      setDelayMinutes(0);
      setRecipients([]);
      setEventSelectionModalActive(true);
    } else if (typeof selectedEventOrAutomation === "string") {
      setSelectedAutomation(null);
      setEvent(selectedEventOrAutomation);
      setMessage(EVENT_TEMPLATES[selectedEventOrAutomation] || "");
      setDelayMinutes(0);
      setRecipients([]);
      setEventSelectionModalActive(false); 
      setAutomationModalActive(true); 
    } else {
      setSelectedAutomation(selectedEventOrAutomation);
      setEvent(selectedEventOrAutomation.event);
      setMessage(selectedEventOrAutomation.message);
      setDelayMinutes(selectedEventOrAutomation.delayMinutes);
      setRecipients(selectedEventOrAutomation.recipients.map((r: any) => r.customer.id));
      setAutomationModalActive(true);
    }
  };
  
  const handleCloseAutomationModal = () => {
    setAutomationModalActive(false);
    setSelectedAutomation(null);
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
        <DashboardCard onOpenModal={handleOpenAutomationModal} automations={automations} />

        </Layout.Section>
      </Layout>

      <EventSelectionModal
        modalActive={eventSelectionModalActive}
        handleClose={handleCloseEventSelectionModal}
        handleContinue={handleOpenAutomationModal}
      />

      <AutomationModal
        automationId={selectedAutomation?.id ?? null} 
        modalActive={automationModalActive}
        handleModalChange={handleCloseAutomationModal}
        handleCloseEventSelectionModal={handleCloseEventSelectionModal}
        event={event ?? ""}
        setEvent={setEvent}
        message={message}
        setMessage={setMessage}
        delayMinutes={delayMinutes}
        setDelayMinutes={setDelayMinutes}
        recipients={recipients}
      />
    </Page>
  );
}
