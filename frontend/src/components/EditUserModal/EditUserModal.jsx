import { Button, Form, Input, message, Modal, Space } from "antd";

import { useEditUserMutation } from "@/store/services/users.js";

export function EditUserModal({ userId, form, isModalOpen, setIsModalOpen }) {
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    editUser({
      userId: userId,
      data: values
    })
    .unwrap()
    .then(() => {
      message.success('Користувач успішно оновлений');
      handleCloseModal();
    })
    .catch(error => message.error(error));
  };

  return (
    <Modal
      title="Редагування користувача"
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="name"
          label="Ім'я"
          rules={[{ required: true, message: "Ім'я обов'зкове" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="surname"
          label="Прізвище"
          rules={[{ required: true, message: "Прізвище обов'зкове" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
          rules={[{ required: true, message: "Телефон обов'зковий" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email обов'зковий" },
            { type: "email", message: "Email некоректний" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isEditing}>
              Зберегти
            </Button>
            <Button onClick={handleCloseModal}>
              Скасувати
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}