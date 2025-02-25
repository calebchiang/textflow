import { Modal, Text } from "@shopify/polaris";

export default function PublishConfirmation({
  modalActive,
  handleConfirmPublish,
  handleClose,
}: {
  modalActive: boolean;
  handleConfirmPublish: () => void;
  handleClose: () => void;
}) {
  return (
    <Modal
      open={modalActive}
      onClose={handleClose}
      title="Confirm Publish"
      primaryAction={{
        content: "Publish",
        onAction: handleConfirmPublish,
        tone: "success",
      }}
      secondaryActions={[{ content: "Cancel", onAction: handleClose }]}
    >
      <Modal.Section>
        <Text>Are you sure you want to publish this automation?</Text>
      </Modal.Section>
    </Modal>
  );
}
