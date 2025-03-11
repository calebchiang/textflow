import { useState } from "react";
import { Page, Layout } from "@shopify/polaris";
import { EVENT_TEMPLATES } from "../constants/events";
import DashboardCard from "./DashboardCard";
import AutomationModal from "./AutomationModal";

export default function Dashboard({ automations }: { automations: any[] }) {
  const [automationModalActive, setAutomationModalActive] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<any | null>(null);
  const [event, setEvent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); 

  const handleOpenAutomationModal = (selectedEventOrAutomation?: string | any) => {
    setCurrentStep(1);
    if (!selectedEventOrAutomation) {
      // User is creating a new automation
      setSelectedAutomation(null);
      setName("");
      setEvent(null);
      setMessage("");
      setDelayMinutes(0);
      setRecipients([]);
    } else if (typeof selectedEventOrAutomation === "string") {
      // User has selected an event to start an automation
      setSelectedAutomation(null);
      setName("");
      setEvent(selectedEventOrAutomation);
      setMessage(EVENT_TEMPLATES[selectedEventOrAutomation] || "");
      setDelayMinutes(0);
      setRecipients([]);
    } else {
      // User is editing an existing automation
      setSelectedAutomation(selectedEventOrAutomation);
      setName(selectedEventOrAutomation.name);
      setEvent(selectedEventOrAutomation.event);
      setMessage(selectedEventOrAutomation.message);
      setDelayMinutes(selectedEventOrAutomation.delayMinutes);
      setRecipients(selectedEventOrAutomation.recipients.map((r: any) => r.customer.id));
    }

    // Open Automation Modal
    setAutomationModalActive(true);
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

      <AutomationModal
        automationId={selectedAutomation?.id ?? null}
        modalActive={automationModalActive}
        handleModalChange={handleCloseAutomationModal}
        event={event ?? ""}
        setEvent={setEvent}
        name={name}
        setName={setName}
        message={message}
        setMessage={setMessage}
        delayMinutes={delayMinutes}
        setDelayMinutes={setDelayMinutes}
        recipients={recipients}
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
      />
    </Page>
  );
}
