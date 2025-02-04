import { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  TextContainer,
  Modal,
  FormLayout,
  TextField,
  Select,
  Checkbox,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { UI_STRINGS } from "../constants/ui";
import { EVENT_DESCRIPTIONS, EVENT_TEMPLATES } from "../constants/events";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Dashboard() {
  const [modalActive, setModalActive] = useState(false);
  const [event, setEvent] = useState("abandoned_cart");
  const [message, setMessage] = useState(EVENT_TEMPLATES["abandoned_cart"]);
  const [status, setStatus] = useState(true);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [recipients, setRecipients] = useState([]);

  const handleModalChange = useCallback(
    () => setModalActive(!modalActive),
    [modalActive]
  );

  const handleSubmit = useCallback(() => {
    alert(
      `Automation Created!\nEvent: ${event}\nMessage: ${message}\nStatus: ${status}\nDelay: ${delayMinutes} minutes\nRecipients: ${recipients.length} selected`
    );
    setModalActive(false);
  }, [event, message, status, delayMinutes, recipients]);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div style={{ textAlign: "center", padding: "70px 0", minHeight: "500px" }}>
              <img 
                src="/sms-icon.png" 
                alt="SMS Automation" 
                style={{ width: "120px", height: "120px", display: "block", margin: "0 auto", marginBottom: "30px" }} 
              />
              <TextContainer>
                <Text as="h2" variant="headingLg" style={{ marginTop: "30px" }}>
                  {UI_STRINGS.HEADING}
                </Text>
                <Text as="p" variant="bodyMd" style={{ marginBottom: "20px" }}>
                  {UI_STRINGS.SUBHEADING}
                </Text>
                <Button primary onClick={handleModalChange}>
                  {UI_STRINGS.BUTTON_CREATE}
                </Button>
              </TextContainer>
            </div>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Modal for Creating Automation */}
      <Modal
        open={modalActive}
        onClose={handleModalChange}
        title={UI_STRINGS.MODAL_TITLE}
        primaryAction={{ content: UI_STRINGS.SAVE_AUTOMATION, onAction: handleSubmit }}
        secondaryActions={[{ content: UI_STRINGS.CANCEL, onAction: handleModalChange }]}
      >
        <Modal.Section>
          <FormLayout>
            <Select
              label={UI_STRINGS.SELECT_EVENT}
              options={Object.keys(EVENT_DESCRIPTIONS).map(key => ({ label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), value: key }))}
              value={event}
              onChange={(value) => {
                setEvent(value);
                setMessage(EVENT_TEMPLATES[value]);
              }}
            />
            <p style={{ fontStyle: "italic", color: "#0057D9", fontWeight: "bold" }}>
              {EVENT_DESCRIPTIONS[event]}
            </p>

            <TextField
              label={UI_STRINGS.SMS_MESSAGE}
              value={message}
              onChange={setMessage}
              multiline={4}
              placeholder={EVENT_TEMPLATES[event]}
            />
            <Checkbox
              label={UI_STRINGS.ENABLE_AUTOMATION}
              checked={status}
              onChange={() => setStatus(!status)}
            />
            <TextField
              label={UI_STRINGS.DELAY_MINUTES}
              type="number"
              value={delayMinutes.toString()}
              onChange={(value) => setDelayMinutes(parseInt(value) || 0)}
              min={0}
            />
            {/* Placeholder for Recipients Selection */}
            <Text>{UI_STRINGS.SELECT_RECIPIENTS}</Text>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
