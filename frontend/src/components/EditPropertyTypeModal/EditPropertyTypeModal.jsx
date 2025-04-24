import { Button, Form, Input, message, Modal, Space } from "antd";

import { 
  useEditAdvertPropertyTypeMutation,
  useCreateAdvertPropertyTypeMutation
} from "@/store/services/advert-property-types.js";

export function EditPropertyTypeModal({ propertyTypeId, form, isModalOpen, setIsModalOpen }) {
  const [editPropertyType, { isLoading: isEditing }] = useEditAdvertPropertyTypeMutation();
  const [createPropertyType, { isLoading: isCreating }] = useCreateAdvertPropertyTypeMutation();

  const isLoading = isEditing || isCreating;
  const isNewPropertyType = !propertyTypeId;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    if (isNewPropertyType) {
      createPropertyType(values)
        .unwrap()
        .then(() => {
          message.success('Вид нерухомості успішно створений');
          handleCloseModal();
        })
        .catch(error => message.error(error.message));
    } else {
      editPropertyType({
        propertyTypeId,
        data: values
      })
      .unwrap()
      .then(() => {
        message.success('Вид нерухомості успішно оновлений');
        handleCloseModal();
      })
      .catch(error => message.error(error.message));
    }
  };

  return (
    <Modal
      title={isNewPropertyType ? "Створення виду нерухомості" : "Редагування виду нерухомості"}
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
          rules={[{ required: true, message: "Назва обов'язкова" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Опис"
          rules={[{ required: true, message: "Опис обов'язковий" }]}
        >
          <Input.TextArea rows={4}/>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isNewPropertyType ? "Створити" : "Зберегти"}
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
