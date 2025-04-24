import { Button, Form, Input, message, Modal, Space } from "antd";

import { useEditAdvertPropertyTypeMutation } from "@/store/services/advert-property-types.js";

export function EditPropertyTypeModal({ propertyTypeId, form, isModalOpen, setIsModalOpen }) {
  const [editPropertyType, { isLoading: isEditing }] = useEditAdvertPropertyTypeMutation();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    editPropertyType({
      propertyTypeId,
      data: values
    })
    .unwrap()
    .then(() => {
      message.success('Вид нерухомості успішно оновлений');
      handleCloseModal();
    })
    .catch(error => message.error(error));
  };

  return (
    <Modal
      title="Редагування виду нерухомості"
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
          label="Назва"
          rules={[{ required: true, message: "Назва обов'зкова" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Опис"
          rules={[{ required: true, message: "Опис обов'зковий" }]}
        >
          <Input.TextArea rows={4}/>
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