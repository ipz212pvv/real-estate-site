import { useRef } from "react";
import { Card, Col, Flex, Form, Input, notification, Row, Typography } from "antd";
import { useSelector } from "react-redux";

import { UploadAvatar } from "@/components/UploadAvatar/UploadAvatar.jsx";

import { useUpdateUserDataMutation } from "@/store/services/users.js";

export default function Profile() {
  const { name, surname, phone, email } = useSelector((state) => state.auth.user);
  const [updateData] = useUpdateUserDataMutation();
  const lastChangedValue = useRef(null);

  const handleFieldChange = (field) => {
    const { name, value, errors, validated } = field[0];

    if (validated && errors.length === 0 && value !== lastChangedValue.current) {
      lastChangedValue.current = value;

      updateData({ [name]: value })
        .unwrap()
        .catch(err => {
          notification.error({
            message: "Помилка",
            description: err.message,
          })
        });
    }
  };

  return (
    <>
      <Typography.Title level={4}>Персональні дані</Typography.Title>
      <Card>
        <Flex gap="middle" wrap>
          <Form
            style={{ flex: "1 1 400px" }}
            onFieldsChange={handleFieldChange}
            initialValues={{ name, surname, phone, email }}
            layout="vertical"
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col flex="1 1 300px">
                <Form.Item
                  name="name"
                  label="Ім'я"
                  validateDebounce={500}
                  rules={[
                    { required: true, message: "Ім'я обов'язкове", whitespace: true },
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col flex="1 1 300px">
                <Form.Item
                  name="surname"
                  label="Прізвище"
                  validateDebounce={500}
                  rules={[
                    { required: true, message: "Прізвище обов'язкове", whitespace: true },
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col flex="1 1 300px">
                <Form.Item
                  name="phone"
                  label="Телефон"
                  validateDebounce={500}
                  rules={[
                    { required: true, message: "Телефон обов'язковий", whitespace: true },
                    { type: "string", pattern: "^[0-9]{10}$", message: "Невірний формат телефону" },
                  ]}
                >
                  <Input addonBefore="+38" />
                </Form.Item>
              </Col>
              <Col flex="1 1 300px">
                <Flex gap="small" vertical>
                  <Typography.Text>Пошта</Typography.Text>
                  <Input defaultValue={email} disabled />
                </Flex>
              </Col>
            </Row>
          </Form>
          <div style={{ margin: "0 auto" }}>
            <UploadAvatar/>
          </div>
        </Flex>
      </Card>
    </>
  )
}