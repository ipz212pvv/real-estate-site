import { useNavigate } from "react-router";
import { Card, Form, Input, notification, Typography, Button } from "antd";

import { useChangeUserPasswordMutation } from "@/store/services/users.js";

export default function ProfileChangePassword() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangeUserPasswordMutation();

  const handleSubmit = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    changePassword({
      currentPassword,
      newPassword,
      confirmPassword
    })
      .unwrap()
      .then(() => navigate("/profile"))
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        });
      });
  };

  return (
    <>
      <Typography.Title level={4}>Зміна пароля</Typography.Title>
      <Card>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
          style={{ maxWidth: "500px" }}
        >
          <Form.Item
            name="currentPassword"
            label="Поточний пароль"
            rules={[
              { required: true, message: "Поточний пароль обов'язковий" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Новий пароль"
            rules={[
              { required: true, message: "Новий пароль обов'язковий" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Підтвердження нового пароля"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Підтвердіть новий пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Паролі не співпадають'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Змінити пароль
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}