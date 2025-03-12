import { useState, useEffect } from "react";
import { Modal, FormLayout, TextField, Button, Text, Icon } from "@shopify/polaris";
import { EVENT_TEMPLATES } from "../constants/events";
import { useFetcher } from "@remix-run/react";
import EventSelection from "./EventSelection";
import RecipientSelection from "./RecipientSelection";

import {
  CartAbandonedIcon,
  CheckCircleIcon,
  DeliveryIcon,
  ComposeIcon,
  DiscountIcon,
  CashDollarIcon,
  StatusActiveIcon,
} from "@shopify/polaris-icons";

const EVENT_ICONS: Record<string, any> = {
  abandoned_cart: CartAbandonedIcon,
  order_confirmation: CheckCircleIcon,
  order_shipped: DeliveryIcon,
  review_request: ComposeIcon,
  send_limited_time_promotion: DiscountIcon,
  customer_first_purchase: CashDollarIcon,
  win_back_campaign: StatusActiveIcon,
};

export default function AutomationModal({
  automationId,
  modalActive,
  handleModalChange,
  event,
  setEvent,
  message,
  setMessage,
  delayMinutes,
  setDelayMinutes,
  recipients,
  setRecipients,
  name,
  setName,
  currentStep,
  setCurrentStep,
}: {
  automationId?: string | null;
  modalActive: boolean;
  handleModalChange: () => void;
  event: string;
  setEvent: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  delayMinutes: number;
  setDelayMinutes: (value: number) => void;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  name: string;
  setName: (value: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const progressPercentage = (currentStep / 3) * 100;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      handleModalChange();
      fetcher.data = null;
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      setErrorMessage(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, handleModalChange]);

  const goNext = () => setCurrentStep((prev) => prev + 1);
  const goBack = () => setCurrentStep((prev) => prev - 1);

  const handleSaveAutomation = () => {
    const formData = new FormData();
    if (automationId) formData.append("automationId", automationId);
    formData.append("storeId", "SHOP_ID");
    formData.append("name", name);
    formData.append("event", event);
    formData.append("message", message);
    formData.append("delayMinutes", delayMinutes.toString());
    formData.append("recipients", JSON.stringify(recipients));

    fetcher.submit(formData, {
      method: automationId ? "put" : "post",
    });

    handleModalChange();
  };

  return (
    <Modal
      open={modalActive}
      onClose={handleModalChange}
      title={
        currentStep === 1
          ? "Choose a Trigger"
          : currentStep === 2
          ? "Setup Your Automation"
          : "Select Recipients"
      }
      primaryAction={{
        content: currentStep === 3 ? "Save Automation" : "Next",
        onAction: currentStep === 3 ? handleSaveAutomation : goNext,
        disabled: currentStep === 1 && !event,
      }}
      secondaryActions={
        currentStep > 1 ? [{ content: "Back", onAction: goBack }] : []
      }
    >
      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#e1e1e1",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            backgroundColor: "#007ace",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>

      <Modal.Section>
        {currentStep === 1 && (
          <EventSelection
            event={event}
            setEvent={(selectedEvent) => {
              setEvent(selectedEvent);
              setMessage(EVENT_TEMPLATES[selectedEvent] || "");
            }}
            setMessage={setMessage}
          />
        )}
        {currentStep === 2 && (
          <>
            <Text as="h3">Selected Trigger</Text>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f9fafc",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon source={EVENT_ICONS[event]} tone="base" />
                <Text as="p" fontWeight="bold">
                  {event.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
              </div>
              <Button onClick={() => setCurrentStep(1)} size="slim">Change</Button>
            </div>
            <div style={{ marginTop: "16px" }}>
              <FormLayout>
                <TextField
                  label="Automation Name"
                  value={name}
                  onChange={setName}
                  placeholder="Enter automation name"
                />
                <TextField
                  label="Message"
                  value={message}
                  onChange={setMessage}
                  multiline={4}
                />
                <TextField
                  label="Delay (minutes)"
                  type="number"
                  value={delayMinutes.toString()}
                  onChange={(value) => setDelayMinutes(parseInt(value) || 0)}
                  min={0}
                />
              </FormLayout>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <RecipientSelection
            handleBack={goBack}
            handleSave={handleSaveAutomation}
            recipients={recipients}
            setRecipients={ 
              setRecipients
            }
          />
        )}

        {errorMessage && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>❌ {errorMessage}</p>}
      </Modal.Section>
    </Modal>
  );
}
