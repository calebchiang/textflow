import { useState, useEffect } from "react";
import { Modal, FormLayout, TextField, Button, Checkbox, Text, Icon } from "@shopify/polaris";
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
  modalActive,
  handleModalChange,
  event,
  setEvent,
  message,
  setMessage,
  delayMinutes,
  setDelayMinutes,
  recipients,
}: {
  modalActive: boolean;
  handleModalChange: () => void;
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

  // Automatically close modal on success, keep open on error
  useEffect(() => {
    if (fetcher.data?.success) {
      handleModalChange(); // Close modal on success
      setErrorMessage(null); // Clear any previous errors
    } else if (fetcher.data?.error) {
      setErrorMessage(fetcher.data.error); // Display error if submission fails
    }
  }, [fetcher.data, handleModalChange]);

  const handleEventSelectionModalChange = () => {
    setEventSelectionModalActive(!eventSelectionModalActive);
  };

  return (
    <>
      <Modal
        open={modalActive}
        onClose={handleModalChange}
        title={UI_STRINGS.MODAL_TITLE}
        primaryAction={{
          content: isSubmitting ? "Saving..." : UI_STRINGS.SAVE_AUTOMATION,
          onAction: () =>
            fetcher.submit(
              {
                storeId: "SHOP_ID",
                event,
                message,
                status: "false",
                delayMinutes: delayMinutes.toString(),
                recipients,
              },
              { method: "post" }
            ),
          disabled: isSubmitting,
        }}
        secondaryActions={[{ content: UI_STRINGS.CANCEL, onAction: handleModalChange }]}
      >
        <Modal.Section>
          <FormLayout>
            {/* Display Selected Event Instead of "Select Event" Button */}
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
                    <Icon source={EVENT_ICONS[event]} tone="base" style={{ width: "24px", height: "24px" }} />
                    <Text as="p" fontWeight="bold" fontSize="16px">
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

            <TextField label={UI_STRINGS.SMS_MESSAGE} value={message} onChange={setMessage} multiline={4} />
            <TextField
              label={UI_STRINGS.DELAY_MINUTES}
              type="number"
              value={delayMinutes.toString()}
              onChange={(value) => setDelayMinutes(parseInt(value) || 0)}
              min={0}
            />

            {errorMessage && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>❌ {errorMessage}</p>}
          </FormLayout>
        </Modal.Section>
      </Modal>

      {/* EventSelectionModal */}
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
