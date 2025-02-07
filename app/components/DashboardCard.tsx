import { Card, Text, TextContainer, Button } from "@shopify/polaris";
import { UI_STRINGS } from "../constants/ui";

export default function DashboardCard({ onOpenModal }: { onOpenModal: () => void }) {
  return (
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
          <Button primary onClick={onOpenModal}>
            {UI_STRINGS.BUTTON_CREATE}
          </Button>
        </TextContainer>
      </div>
    </Card>
  );
}
