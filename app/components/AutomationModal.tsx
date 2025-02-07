import { Modal, FormLayout, TextField, Select, Checkbox } from "@shopify/polaris";
import { UI_STRINGS } from "../constants/ui";
import { EVENT_DESCRIPTIONS, EVENT_TEMPLATES } from "../constants/events";
import { useFetcher } from "@remix-run/react";

export default function AutomationModal({
  modalActive,
  handleModalChange,
  event,
  setEvent,
  message,
  setMessage,
  status,
  setStatus,
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
  status: boolean;
  setStatus: (value: boolean) => void;
  delayMinutes: number;
  setDelayMinutes: (value: number) => void;
  recipients: string[];
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
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
              status: status.toString(),
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
          <Select
            label={UI_STRINGS.SELECT_EVENT}
            options={Object.keys(EVENT_DESCRIPTIONS).map((key) => ({
              label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              value: key,
            }))}
            value={event}
            onChange={(value) => {
              setEvent(value);
              setMessage(EVENT_TEMPLATES[value]);
            }}
          />
          <p style={{ color: "#0057D9", fontWeight: "bold" }}>{EVENT_DESCRIPTIONS[event]}</p>

          <TextField label={UI_STRINGS.SMS_MESSAGE} value={message} onChange={setMessage} multiline={4} />
          <Checkbox label={UI_STRINGS.ENABLE_AUTOMATION} checked={status} onChange={() => setStatus(!status)} />
          <TextField
            label={UI_STRINGS.DELAY_MINUTES}
            type="number"
            value={delayMinutes.toString()}
            onChange={(value) => setDelayMinutes(parseInt(value) || 0)}
            min={0}
          />
          {fetcher.data?.success && <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>✅ Automation saved successfully!</p>}
          {fetcher.data?.error && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>❌ {fetcher.data.error}</p>}
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}
