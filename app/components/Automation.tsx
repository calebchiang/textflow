import { Text, Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronDownIcon } from "@shopify/polaris-icons";

export default function Automation({ automation, isLast }: { automation: any; isLast: boolean }) {
  const [popoverActive, setPopoverActive] = useState(false);

  const formatDelayTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = (minutes / 60).toFixed(1);
    return `${hours} hr`;
  };

  const statusLabel = automation.status ? "Active" : "Draft";
  const togglePopoverActive = useCallback(() => setPopoverActive((active) => !active), []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.2fr 0.2fr 0.2fr", // Matches header structure
        alignItems: "center",
        borderBottom: "1px solid #E1E3E5",
        padding: "0px 20px", 
        minHeight:"60px",
      }}
    >
      {/* Event Name */}
      <Text as="h3" variant="bodyMd">
        {automation.event.replace(/_/g, " ")}
      </Text>

      {/* Delay Time */}
      <Text as="p" variant="bodyMd" tone="base">
        {formatDelayTime(automation.delayMinutes)}
      </Text>

      {/* Status */}
      <Text as="p" fontWeight="bold" tone={automation.status ? "success" : "subdued"}>
        {statusLabel}
      </Text>

      {/* Actions Popover */}
      <Popover
        active={popoverActive}
        activator={
          <Button onClick={togglePopoverActive} icon={ChevronDownIcon}>
          </Button>
        }
        onClose={togglePopoverActive}
      >
        <ActionList
          items={[
            { content: "Publish", onAction: () => console.log("Publishing automation:", automation.id) },
            { content: "Edit", onAction: () => console.log("Editing automation:", automation.id) },
            { content: "Delete", destructive: true, onAction: () => console.log("Deleting automation:", automation.id) },
          ]}
        />
      </Popover>
    </div>
  );
}
