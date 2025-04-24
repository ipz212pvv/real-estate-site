import { Button, Form, Input, message, Modal, Space } from "antd";

import { useEditBenefitMutation, useCreateBenefitMutation } from "@/store/services/benefits.js";

export function EditBenefitModal({ benefitId, form, isModalOpen, setIsModalOpen }) {
  const [editBenefit, { isLoading: isEditing }] = useEditBenefitMutation();
  const [createBenefit, { isLoading: isCreating }] = useCreateBenefitMutation();

  const isLoading = isEditing || isCreating;
  const isNewBenefit = !benefitId;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    if (isNewBenefit) {
      createBenefit(values)
        .unwrap()
        .then(() => {
          message.success('Перевагу успішно створено');
          handleCloseModal();
        })
        .catch(error => message.error(error.message));
    } else {
      editBenefit({
        benefitId,
        data: values
      })
        .unwrap()
        .then(() => {
          message.success('Перевагу успішно оновлено');
          handleCloseModal();
        })
        .catch(error => message.error(error.message));
    }
  };

  return (
    <Modal
      title={isNewBenefit ? "Створення переваги" : "Редагування переваги"}
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
              {isNewBenefit ? "Створити" : "Зберегти"}
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