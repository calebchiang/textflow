import { useState } from "react";
import { Page, Layout } from "@shopify/polaris";
import { EVENT_TEMPLATES } from "../constants/events";
import DashboardCard from "./DashboardCard";
import AutomationModal from "./AutomationModal";
import EventSelectionModal from "./EventSelectionModal";

export default function Dashboard({ automations }: { automations: any[] }) {
  const [eventSelectionModalActive, setEventSelectionModalActive] = useState(false);
  const [automationModalActive, setAutomationModalActive] = useState(false);
  const [event, setEvent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedAutomation, setSelectedAutomation] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);

  const handleCloseEventSelectionModal = () => setEventSelectionModalActive(false);

  const handleOpenAutomationModal = (selectedEventOrAutomation?: string | any) => {
    if (!selectedEventOrAutomation) {
      setSelectedAutomation(null);
      setName("");
      setEvent(null);
      setMessage("");
      setDelayMinutes(0);
      setRecipients([]);
      setEventSelectionModalActive(true);
    } else if (typeof selectedEventOrAutomation === "string") {
      setSelectedAutomation(null);
      setName("");
      setEvent(selectedEventOrAutomation);
      setMessage(EVENT_TEMPLATES[selectedEventOrAutomation] || "");
      setDelayMinutes(0);
      setRecipients([]);
      setEventSelectionModalActive(false);
      setAutomationModalActive(true);
    } else {
      setSelectedAutomation(selectedEventOrAutomation);
      setName(selectedEventOrAutomation.name);
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
        name={name}
        setName={setName}
        message={message}
        setMessage={setMessage}
        delayMinutes={delayMinutes}
        setDelayMinutes={setDelayMinutes}
        recipients={recipients}
      />
    </Page>
  );
}
