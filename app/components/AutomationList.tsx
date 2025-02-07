import { Card, Text, Button } from "@shopify/polaris";
import Automation from "./Automation";

export default function AutomationList({ automations, onOpenModal }: { automations: any[], onOpenModal: () => void }) {
  return (
    <Card sectioned>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Text as="h2" variant="headingLg">Automations</Text>
        <Button primary onClick={onOpenModal}>
          ➕
        </Button>
      </div>

      {automations.length > 0 ? (
        automations.map((automation) => <Automation key={automation.id} automation={automation} />)
      ) : (
        <Text>No automations created yet. Click the button to create one!</Text>
      )}
    </Card>
  );
}
