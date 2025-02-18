import { useState, useCallback } from "react";
import { useFetcher } from "@remix-run/react";
import { Text, Button, Popover, ActionList } from "@shopify/polaris";
import { ChevronDownIcon } from "@shopify/polaris-icons";
import DeleteConfirmation from "./DeleteConfirmation"; 

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
  const [deleteModalActive, setDeleteModalActive] = useState(false); 
  const fetcher = useFetcher();

  const togglePopoverActive = useCallback(() => setPopoverActive((active) => !active), []);

  const handleDelete = () => {
    fetcher.submit(
      { automationId: automation.id },
      { method: "delete" }
    );
    setDeleteModalActive(false); 
  };

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
        <Text as="h3" variant="bodyMd">
          {automation.event.replace(/_/g, " ")}
        </Text>

        <Text as="p" variant="bodyMd" tone="base">
          {automation.delayMinutes} min
        </Text>

        <Text as="p" fontWeight="bold" tone={automation.status ? "success" : "subdued"}>
          {automation.status ? "Active" : "Draft"}
        </Text>

        <Popover
          active={popoverActive}
          activator={<Button onClick={togglePopoverActive} icon={ChevronDownIcon} />}
          onClose={togglePopoverActive}
        >
          <ActionList
            items={[
              { content: "Publish", onAction: () => console.log("Publishing automation:", automation.id) },
              { content: "Edit", onAction: () => handleOpenAutomationModal(automation) }, 
              { content: "Delete", destructive: true, onAction: () => setDeleteModalActive(true) }, 
            ]}
          />
        </Popover>
      </div>

      <DeleteConfirmation
        modalActive={deleteModalActive}
        handleConfirmDelete={handleDelete}
        handleClose={() => setDeleteModalActive(false)}
      />
    </>
  );
}
