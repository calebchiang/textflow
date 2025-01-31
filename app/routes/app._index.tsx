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
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Dashboard() {
  const [modalActive, setModalActive] = useState(false);
  const [event, setEvent] = useState("abandoned_cart");
  const [message, setMessage] = useState("");

  const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);

  const handleSubmit = useCallback(() => {
    alert(`Automation Created!\nEvent: ${event}\nMessage: ${message}`);
    setModalActive(false);
  }, [event, message]);

  return (
    <Page>
      <TitleBar title="TextFlow - SMS Automations" />
      <Layout>
        <Layout.Section>
          <Card title="Your Automations" sectioned>
            <TextContainer>
              <Text as="p">
                Set up SMS automations to engage customers with abandoned cart recovery, promotions, and reviews.
              </Text>
              <Button primary onClick={handleModalChange}>
                Create New Automation
              </Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Modal for Creating Automation */}
      <Modal
        open={modalActive}
        onClose={handleModalChange}
        title="Create New SMS Automation"
        primaryAction={{
          content: "Save Automation",
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleModalChange,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <Select
              label="Select Event"
              options={[
                { label: "Abandoned Cart", value: "abandoned_cart" },
                { label: "Order Confirmation", value: "order_confirmation" },
                { label: "Review Request", value: "review_request" },
              ]}
              value={event}
              onChange={setEvent}
            />
            <TextField
              label="SMS Message"
              value={message}
              onChange={setMessage}
              multiline={3}
              placeholder="Type your SMS message here..."
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
