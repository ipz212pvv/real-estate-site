import { useNavigate } from "react-router";
import { Card, notification, Typography } from "antd";

import { AdvertForm } from "@/components/AdvertForm/AdvertForm.jsx";

import { useCreateAdvertMutation } from "@/store/services/adverts.js";

export default function ProfileAdvertsCreate() {
  const navigate = useNavigate();

  const [createAdvert] = useCreateAdvertMutation();

  const onFinish = (formData, onFinal) => {
    createAdvert(formData)
      .unwrap()
      .then(({ id }) => navigate(`/profile/adverts/${id}/edit`))
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      })
      .finally(onFinal);
  };

  return (
    <>
      <Typography.Title level={4} style={{ margin: 0 }}>Створення оголошення</Typography.Title>
      <Card style={{ marginTop: 16 }}>
        <AdvertForm onFinish={onFinish} submitBtnName="Створити" />
      </Card>
    </>
  )
}