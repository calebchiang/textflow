import { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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
import { authenticate } from "../shopify.server";
import { UI_STRINGS } from "../constants/ui";
import { EVENT_DESCRIPTIONS, EVENT_TEMPLATES } from "../constants/events";
import { createAutomation } from "../utils/automations"; 

/**
 * authenticates shopify admin user before rendering the page
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

/**
 * Receives form submisson data from frontend, calls createAutomation() util function
 */
export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    console.log("Session Data:", session);

    // extract shopify store id
    const storeId = session.shop;
    console.log(storeId);

    const formData = await request.formData();
    
    const event = formData.get("event")?.toString();
    const message = formData.get("message")?.toString();
    const status = formData.get("status") === "true";
    const delayMinutes = formData.get("delayMinutes") ? Number(formData.get("delayMinutes")) : 0;
    const recipients = JSON.parse(formData.get("recipients") || "[]");

    if (!storeId || !event || !message) {
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // save to db using util function
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

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleModalChange = useCallback(() => {
    setModalActive(!modalActive);
  }, [modalActive]);

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
        primaryAction={{
          content: isSubmitting ? "Saving..." : UI_STRINGS.SAVE_AUTOMATION,
          onAction: () => fetcher.submit(
            {
              storeId: "SHOP_ID", // Replace with actual store ID
              event,
              message,
              status: status.toString(),
              delayMinutes: delayMinutes.toString(),
              recipients, // Ensure recipients are properly formatted
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
            <p style={{ color: "#0057D9", fontWeight: "bold" }}>
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
            {/* Display success or error message */}
            {fetcher.data?.success && (
              <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
                ✅ Automation saved successfully!
              </p>
            )}
            {fetcher.data?.error && (
              <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
                ❌ {fetcher.data.error}
              </p>
            )}
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
