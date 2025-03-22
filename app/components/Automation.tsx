import { useState, useCallback } from "react";
import { useFetcher } from "@remix-run/react";
import { Text, Button, Popover, ActionList } from "@shopify/polaris";
import { ChevronDownIcon } from "@shopify/polaris-icons";
import DeleteConfirmation from "./DeleteConfirmation"; 
import PublishConfirmation from "./PublishConfirmation";

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
  const [publishModalActive, setPublishModalActive] = useState(false);
  const [automationStatus, setAutomationStatus] = useState(automation.status);
  const fetcher = useFetcher();

  const togglePopoverActive = useCallback(() => setPopoverActive((active) => !active), []);

  const handleDelete = () => {
    fetcher.submit(
      { automationId: automation.id },
      { method: "delete" }
    );
    setDeleteModalActive(false); 
  };

  const handlePublish = async () => {
    try {
      console.log("Publishing automation:", automation.id);

      const response = await fetch("/api/update/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automationId: automation.id, status: true }),
      });

      const result = await response.json();
      if (result.success) {
        setAutomationStatus(true);
        console.log("Automation status updated successfully:", result);
      } else {
        console.error("Failed to update automation status:", result.error);
        setPublishModalActive(false);
        return;
      }

      if (automation.event === "send_limited_time_promotion") {
        const sendResponse = await fetch("/api/send/promotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ automationId: automation.id }),
        });
  
        const sendResult = await sendResponse.json();
        if (sendResult.success) {
          console.log("✅ Promotion SMS sent successfully:", sendResult.results);
        } else {
          console.error("❌ Failed to send promotion SMS:", sendResult.error);
        }
      }
    } catch (error) {
      console.error("Error publishing automation:", error);
    }
  
    setPublishModalActive(false);
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
          {automation.name}
        </Text>

        <Text as="p" variant="bodyMd" tone="base">
          {automation.delayMinutes} min
        </Text>

        <Text as="p" fontWeight="bold" tone={automationStatus ? "success" : "subdued"}>
          {automationStatus ? "Active" : "Draft"}
        </Text>

        <Popover
          active={popoverActive}
          activator={<Button onClick={togglePopoverActive} icon={ChevronDownIcon} />}
          onClose={togglePopoverActive}
        >
          <ActionList
            items={[
              { content: "Publish", onAction: () => setPublishModalActive(true)},
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

      <PublishConfirmation
        modalActive={publishModalActive}
        handleConfirmPublish={handlePublish}
        handleClose={() => setPublishModalActive(false)}
      />
    </>
  );
}
