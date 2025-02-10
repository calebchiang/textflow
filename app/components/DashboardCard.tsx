import { Text, Button } from "@shopify/polaris";
import { UI_STRINGS } from "../constants/ui";
import AutomationList from "./AutomationList";

export default function DashboardCard({
  onOpenModal,
  automations,
}: {
  onOpenModal: () => void;
  automations: any[];
}) {
  return (
    <>
      {automations && automations.length > 0 ? (
        <AutomationList automations={automations} />
      ) : (
        <div style={{ textAlign: "center", padding: "70px 0", minHeight: "500px" }}>
          <img
            src="/sms-icon.png"
            alt="SMS Automation"
            style={{ width: "120px", height: "120px", display: "block", margin: "0 auto", marginBottom: "30px" }}
          />
          <Text as="h2" variant="headingLg" style={{ marginTop: "30px" }}>
            {UI_STRINGS.HEADING}
          </Text>
          <br></br>
          <Text as="p" variant="bodyMd" style={{ marginBottom: "20px" }}>
            {UI_STRINGS.SUBHEADING}
          </Text>
          <br></br>
          <Button primary onClick={onOpenModal}>
            {UI_STRINGS.BUTTON_CREATE}
          </Button>
        </div>
      )}
    </>
  );
}
