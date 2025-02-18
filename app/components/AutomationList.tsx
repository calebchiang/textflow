import { Box, Text, Button } from "@shopify/polaris";
import Automation from "./Automation";
import { PlusCircleIcon } from "@shopify/polaris-icons";

export default function AutomationList({ automations, onOpenModal }: { automations: any[], onOpenModal: (automation?: any) => void }) {
  return (
    <div style={{ borderRadius: "5px", overflow: "hidden"}}>
    <Box background="bg-surface">
      <div 
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "16px 20px",
          backgroundColor: "#FFFFFF" ,
          minHeight: "100px",
        }}
      >
        <Text as="h1" variant="headingXl">Automations</Text>
        <Button onClick={() => onOpenModal(null)} icon={PlusCircleIcon}>
          Add
        </Button>      
        </div>
      {automations.length > 0 && (
        <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 0.2fr 0.2fr 0.2fr",
          alignItems: "center",
          fontWeight: "bold",
          backgroundColor: "#F9FAFB",
          minHeight: "60px",
          width: "100%",
          padding: "0px 20px", 
        }}
        >
          <Text as="p" variant="bodyMd" tone="subdued">Name</Text>
          <Text as="p" variant="bodyMd" tone="subdued">Delay</Text>
          <Text as="p" variant="bodyMd" tone="subdued">Status</Text>
          <Text as="p" variant="bodyMd" tone="subdued">Actions</Text>
        </div>
      )}

      {/* Automation Rows (White Background) */}
      {automations.length > 0 ? (
        automations.map((automation, index) => (
          <div 
            key={automation.id} 
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Automation 
              automation={automation} 
              isLast={index === automations.length - 1} 
              handleOpenAutomationModal={onOpenModal} 
            />
          </div>
        ))
      ) : (
        <Text as="p">No automations created yet. Click the button to create one!</Text>
      )}
    </Box>
    </div>
  );
}
