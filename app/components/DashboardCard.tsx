import { Text, Button, Card } from "@shopify/polaris";
import { UI_STRINGS } from "../constants/ui";
import AutomationList from "./AutomationList";

export default function DashboardCard({
  onOpenModal,
  automations,
}: {
  onOpenModal: (automation?: any) => void;
  automations: any[];
}) {
  return (
    <>
      {automations && automations.length > 0 ? (
        <AutomationList automations={automations} onOpenModal={onOpenModal} />
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <div style={{ width: "700px" }}>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
                <img
                  src="/sms-icon.png"
                  alt="SMS Automation"
                  style={{ width: "150px", height: "150px", objectFit: "contain" }}
                />

                <Text as="h2" variant="heading2xl">{UI_STRINGS.HEADING}</Text>
                <Text as="p" variant="bodyLg">{UI_STRINGS.SUBHEADING}</Text>

                <Button onClick={() => onOpenModal(null)} size="large">
                  {UI_STRINGS.BUTTON_CREATE}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
