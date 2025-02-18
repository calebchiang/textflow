import { useState, useEffect } from "react";
import { Modal, FormLayout, TextField, Button, Text, Icon } from "@shopify/polaris";
import { UI_STRINGS } from "../constants/ui";
import { EVENT_TEMPLATES } from "../constants/events";
import { useFetcher } from "@remix-run/react";
import EventSelectionModal from "./EventSelectionModal";

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
  handleCloseEventSelectionModal,
  event,
  setEvent,
  message,
  setMessage,
  delayMinutes,
  setDelayMinutes,
  recipients,
}: {
  automationId?: string | null;
  modalActive: boolean;
  handleModalChange: () => void;
  handleCloseEventSelectionModal: () => void;
  event: string;
  setEvent: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  delayMinutes: number;
  setDelayMinutes: (value: number) => void;
  recipients: string[];
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const [eventSelectionModalActive, setEventSelectionModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      handleModalChange(); 
      handleCloseEventSelectionModal(); 
      fetcher.data = null; 
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      setErrorMessage(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, handleModalChange, handleCloseEventSelectionModal, fetcher]);
  
  const handleEventSelectionModalChange = () => {
    setEventSelectionModalActive(!eventSelectionModalActive);
  };

  return (
    <>
      <Modal
        open={modalActive}
        onClose={handleModalChange}
        title={automationId ? UI_STRINGS.EDIT_AUTOMATION_TITLE : UI_STRINGS.MODAL_TITLE}
        primaryAction={{
          content: isSubmitting ? "Saving..." : automationId ? UI_STRINGS.UPDATE_AUTOMATION : UI_STRINGS.SAVE_AUTOMATION,
          onAction: () => {
            const formData = new FormData();
            if (automationId) formData.append("automationId", automationId);
            formData.append("storeId", "SHOP_ID");
            formData.append("event", event);
            formData.append("message", message);
            formData.append("delayMinutes", delayMinutes.toString());
            formData.append("recipients", JSON.stringify(recipients)); 

            fetcher.submit(formData, {
              method: automationId ? "put" : "post", 
            });
          },
          disabled: isSubmitting,
        }}
        secondaryActions={[{ content: UI_STRINGS.CANCEL, onAction: handleModalChange }]}
      >
        <Modal.Section>
          <FormLayout>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f9fafc",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {event ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon source={EVENT_ICONS[event]} tone="base"/>
                    <Text as="p" fontWeight="bold">
                      {event.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Text>
                  </div>
                  <Button onClick={handleEventSelectionModalChange} size="slim">
                    Change
                  </Button>
                </>
              ) : (
                <Button onClick={handleEventSelectionModalChange} fullWidth>
                  Select Event
                </Button>
              )}
            </div>

            <TextField label={UI_STRINGS.SMS_MESSAGE} value={message} onChange={setMessage} multiline={4} autoComplete="off" />
            <TextField
              label={UI_STRINGS.DELAY_MINUTES}
              type="number"
              value={delayMinutes.toString()}
              onChange={(value) => setDelayMinutes(parseInt(value) || 0)}
              min={0}
              autoComplete="off"
            />

            {errorMessage && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>❌ {errorMessage}</p>}
          </FormLayout>
        </Modal.Section>
      </Modal>

      {/* ✅ EventSelectionModal */}
      <EventSelectionModal
        modalActive={eventSelectionModalActive}
        handleClose={handleEventSelectionModalChange}
        handleContinue={(selectedEvent) => {
          setEvent(selectedEvent);
          setMessage(EVENT_TEMPLATES[selectedEvent] || "");
          setEventSelectionModalActive(false);
        }}
      />
    </>
  );
}
