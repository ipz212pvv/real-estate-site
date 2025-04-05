import { useMemo } from "react";
import { Button, Card, Flex, Form, Input, notification, Select, Typography } from "antd";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { PiBagBold } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { registerUser } from "@/store/slices/authSlice.js";
import { useGetUserTypesQuery } from "@/store/services/userTypes.js";

export function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: userTypes = [], isLoading: loadingUserTypes } = useGetUserTypesQuery();

  const userTypeOptions = useMemo(() => userTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [userTypes]);

  const onFinish = (userData) => {
    userData.phone = `+380${userData.phone}`;

    dispatch(registerUser(userData))
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
          Реєстрація акаунту
        </Typography.Title>
        <Form onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Ім'я обов'язкове", whitespace: true },
            ]}
          >
            <Input prefix={<FaRegUser />} placeholder="Ім'я" />
          </Form.Item>
          <Form.Item
            name="surname"
            rules={[
              { required: true, message: "Прізвище обов'язкове", whitespace: true  },
            ]}
          >
            <Input prefix={<FaRegUser />} placeholder="Прізвище" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Телефон обов'язковий", whitespace: true },
              { type: "string", pattern: "^[0-9]{9}$", message: "Невірний формат телефону" },
            ]}
          >
            <Input addonBefore="+380" placeholder="Телефон" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Пошта обов'язкова" },
              { type: "email", message: "Невірний формат пошти" }
            ]}
          >
            <Input prefix={<MdOutlineAlternateEmail />} placeholder="Пошта" />
          </Form.Item>
          <Form.Item name="userTypeId" rules={[{ required: true, message: "Виберіть хто ви" }]}>
            <Select
              placeholder="Хто ви?"
              loading={loadingUserTypes}
              disabled={loadingUserTypes}
              prefix={<PiBagBold style={{ marginTop: "6px" }} />}
              options={userTypeOptions}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пароль обов'язковий" }]}
          >
            <Input.Password prefix={<TbLockPassword />} placeholder="Пароль" />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button style={{ fontSize: 16 }} size="large" block type="primary" htmlType="submit">
              Зареєструватися
            </Button>
            Вже є акаунт? <Button href="/login" type="link" style={{ padding: 0 }}>Увійти</Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}