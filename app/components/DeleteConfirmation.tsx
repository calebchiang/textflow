import { Modal, Text } from "@shopify/polaris";

export default function DeleteConfirmation({
  modalActive,
  handleConfirmDelete,
  handleClose,
}: {
  modalActive: boolean;
  handleConfirmDelete: () => void;
  handleClose: () => void;
}) {
  return (
    <Modal
      open={modalActive}
      onClose={handleClose}
      title="Delete Automation?"
      primaryAction={{
        content: "Yes, Delete",
        destructive: true, 
        onAction: handleConfirmDelete,
      }}
      secondaryActions={[{ content: "Cancel", onAction: handleClose }]}
    >
      <Modal.Section>
        <Text as="p">Are you sure you want to delete this automation? This action cannot be undone.</Text>
      </Modal.Section>
    </Modal>
  );
}
