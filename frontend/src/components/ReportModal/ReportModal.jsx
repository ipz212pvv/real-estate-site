import { useState } from "react";
import { Form, Modal, Input, Flex, Button, notification } from "antd";
import { LuFlag } from "react-icons/lu";

import { useAddComplaintMutation } from "@/store/services/complaints.js";

export function ReportModal({ advertId }) {
  const [open, setOpen] = useState(false);
  const [sendReport, { isLoading }] = useAddComplaintMutation();
  const [reportForm] = Form.useForm();

  const handleSubmit = (formData) => {
    const { message } = formData;

    sendReport({ message, advertId })
      .unwrap()
      .then(() => {
        setOpen(false);
        reportForm.resetFields();
        notification.success({
          message: "Успішно",
          description: "Скаргу успішно надіслано!",
        })
      })
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      })
  };

  return (
    <>
      <Button
        title="Поскаржитися"
        size="small"
        type="text"
        onClick={() => setOpen(true)}
        icon={<LuFlag size={24} />}
      />
      <Modal
        title="Скарга на оголошення"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          form={reportForm}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="message"
            label="Опис скарги"
            rules={[{ required: true, message: "Опис скарги обов'язковий" }]}
            style={{ marginTop: 16 }}
          >
            <Input.TextArea rows={4} placeholder="Опишіть детально причину вашої скарги" />
          </Form.Item>
          <Form.Item>
            <Flex justify="flex-end" gap={8}>
              <Button onClick={() => setOpen(false)}>Скасувати</Button>
              <Button type="primary" disabled={isLoading} htmlType="submit" danger>Надіслати скаргу</Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}