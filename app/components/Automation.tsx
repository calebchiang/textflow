import { useState, useCallback } from "react";
import { Text, Button, Popover, ActionList } from "@shopify/polaris";
import { ChevronDownIcon } from "@shopify/polaris-icons";

export default function Automation({ 
  automation, 
  isLast, 
  handleOpenAutomationModal 
}: { 
  automation: any; 
  isLast: boolean;
  handleOpenAutomationModal: (automation: any) => void;
}) {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(() => setPopoverActive((active) => !active), []);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 0.2fr 0.2fr 0.2fr",
          alignItems: "center",
          borderBottom: "1px solid #E1E3E5",
          padding: "0px 20px",
          minHeight: "60px",
        }}
      >
        {/* Event Name */}
        <Text as="h3" variant="bodyMd">
          {automation.event.replace(/_/g, " ")}
        </Text>

        {/* Delay Time */}
        <Text as="p" variant="bodyMd" tone="base">
          {automation.delayMinutes} min
        </Text>

        {/* Status */}
        <Text as="p" fontWeight="bold" tone={automation.status ? "success" : "subdued"}>
          {automation.status ? "Active" : "Draft"}
        </Text>

        {/* Actions Popover */}
        <Popover
          active={popoverActive}
          activator={<Button onClick={togglePopoverActive} icon={ChevronDownIcon} />}
          onClose={togglePopoverActive}
        >
          <ActionList
            items={[
              { content: "Publish", onAction: () => console.log("Publishing automation:", automation.id) },
              { content: "Edit", onAction: () => handleOpenAutomationModal(automation) }, 
              { content: "Delete", destructive: true, onAction: () => console.log("Deleting automation:", automation.id) },
            ]}
          />
        </Popover>
      </div>
    </>
  );
}
