import { Button, Card, Flex, Form, Input, notification, Typography } from "antd";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { loginUser } from "@/store/slices/authSlice.js";

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (userData) => {
    dispatch(loginUser(userData))
      .unwrap()
      .then(() => navigate("/account"))
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      });
  };

  return (
    <Flex style={{ marginTop: 50 }} align="center" vertical>
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <Typography.Title
          style={{ textAlign: "center", marginBottom: 40 }}
          level={2}
        >
          Вхід в акаунт
        </Typography.Title>
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Пошта обов'язкова" },
              { type: "email", message: "Невірний формат пошти" }
            ]}
          >
            <Input prefix={<MdOutlineAlternateEmail />} placeholder="Пошта" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пароль обов'язковий" }]}
          >
            <Input prefix={<TbLockPassword />} type="password" placeholder="Пароль" />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button style={{ fontSize: 16 }} size="large" block type="primary" htmlType="submit">
              Увійти
            </Button>
            або <Button href="/registration" type="link" style={{ padding: 0 }}>Зареєструватися</Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}