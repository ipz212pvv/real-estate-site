import { Modal, Typography } from "antd";

export function ViewComplaintModal({ isModalOpen, setIsModalOpen, complaint }) {
  return (
    <Modal
      title="Перегляд скарги"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Typography.Paragraph style={{ marginTop: 16, marginBottom: 8 }} >{complaint?.message}</Typography.Paragraph>
    </Modal>
  );
}