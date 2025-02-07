import { Card, Text, Button, InlineStack } from "@shopify/polaris";

export default function Automation({ automation }: { automation: any }) {
  return (
    <Card sectioned>
      <InlineStack align="space-between">
        <Text as="h3" variant="headingMd">
          {automation.event.replace(/_/g, " ")}
        </Text>
        <Button plain destructive onClick={() => console.log("Delete automation:", automation.id)}>
          Delete
        </Button>
      </InlineStack>
      <Text as="p" variant="bodyMd" style={{ marginTop: "10px" }}>
        {automation.message}
      </Text>
    </Card>
  );
}
