import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Col, Form, InputNumber, notification, Input, Row, Select, Typography } from "antd";

import { Loading } from "@/components/common/Loading/Loading.jsx";
import { FormMapLocationSelect } from "@/components/FormMapLocationSelect/FormMapLocationSelect.jsx";

import { useGetAdvertTypesQuery } from "@/store/services/advert-types.js";
import { useGetAdvertPropertyTypesQuery } from "@/store/services/advert-property-types.js";
import { useCreateAdvertMutation } from "@/store/services/adverts.js";

const suffixSelector = (
  <Form.Item name="priceCurrency" noStyle>
    <Select style={{ width: 75 }}>
      <Select.Option value="usd">$</Select.Option>
      <Select.Option value="uah">грн</Select.Option>
    </Select>
  </Form.Item>
);

export function ProfileAdvertsCreate() {
  const navigate = useNavigate();

  const {
    data: advertTypes = [],
    isLoading: advertTypesLoading
  } = useGetAdvertTypesQuery();
  const {
    data: advertPropertyTypes = [],
    isLoading: advertPropertyTypesLoading
  } = useGetAdvertPropertyTypesQuery();
  const [createAdvert, { isLoading: loadingCreateAdvert }] = useCreateAdvertMutation();

  const initialValues = {
    priceCurrency: "usd"
  }

  const advertTypeOptions = useMemo(() => advertTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [advertTypes]);

  const advertPropertyTypeOptions = useMemo(() => advertPropertyTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [advertTypes]);

  if (advertTypesLoading || advertPropertyTypesLoading) return <Loading/>

  const onFinish = (formData) => {
    const { priceCurrency, price, location } = formData;

    if(priceCurrency === "usd") formData.price_usd = price;
    if(priceCurrency === "uah") formData.price_uah = price;

    formData.lat = location.lat;
    formData.lon = location.lng;

    delete formData.price;
    delete formData.priceCurrency;
    delete formData.location;

    createAdvert(formData)
      .unwrap()
      .then(({ id }) => navigate(`/profile/adverts/${id}`))
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      });
  };

  return (
    <>
      <Typography.Title level={4} style={{ margin: 0 }}>Створення оголошення</Typography.Title>
      <Card style={{ marginTop: 16 }}>
        <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Заголовок"
                rules={[
                  { required: true, message: "Заголовок обов'язковий" }
                ]}
              >
                <Input placeholder="Введіть заголовок" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="typeId" label="Вид пропозиції" rules={[{ required: true, message: "Оберіть вид пропозиції" }]}>
                <Select options={advertTypeOptions} placeholder="Оберіть вид пропозиції" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="propertyTypeId" label="Вид нерухомості" rules={[{ required: true, message: "Оберіть вид нерухомості" }]}>
                <Select options={advertPropertyTypeOptions} placeholder="Оберіть вид нерухомості" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="Ціна"
                rules={[
                  { required: true, message: "Ціна обов'язкова" },
                  { type: "number", min: 1, message: "Некоректне значення" }
                ]}
              >
                <InputNumber style={{ width: "100%" }} addonAfter={suffixSelector} placeholder="Введіть ціну" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="area"
                label="Загальна площа"
                rules={[
                  { required: true, message: "Площа обов'язкова" },
                  { type: "number", min: 1, message: "Некоректне значення" }
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Введіть загальну площу" />
              </Form.Item>
            </Col>
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const propertyType = getFieldValue("propertyTypeId");
                const isFlat = propertyType === 1;
                const isHouse = propertyType === 2;
                const floorField = isFlat ? {
                  label: "Поверх",
                  placeholder: "Введіть поверх",
                  required_message: "Поверх обов'язковий"
                } : {
                  label: "Кількість поверхів",
                  placeholder: "Введіть кількість поверхів",
                  required_message: "Кількість поверхів обов'язкова"
                }

                return (isFlat || isHouse) && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="room"
                        label="Кількість кімнат"
                        rules={[
                          { required: true, message: "Кількість кімнат обов'язкова" },
                          { type: "number", min: 1, message: "Некоректне значення" }
                        ]}
                      >
                        <InputNumber style={{ width: "100%" }} placeholder="Введіть кількість кімнат" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="floor"
                        label={floorField.label}
                        rules={[
                          { required: true, message:  floorField.required_message },
                          { type: "number", min: 1, message: "Некоректне значення" }
                        ]}
                      >
                        <InputNumber style={{ width: "100%" }} placeholder={floorField.placeholder} />
                      </Form.Item>
                    </Col>
                  </>
                )
              }}
            </Form.Item>
            <Col span={24}>
              <Form.Item
                name="location"
                label="Місце знаходження"
                rules={[
                  { required: true, message: "Місце знаходження обов'язкове" },
                ]}
              >
                <FormMapLocationSelect/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Опис">
                <Input.TextArea placeholder="Опис до оголошення..." rows={6}/>
              </Form.Item>
            </Col>
          </Row>
          <Button
            style={{ fontSize: 16, marginTop: 16 }}
            disabled={loadingCreateAdvert}
            size="large"
            type="primary"
            htmlType="submit"
            block
          >
            Створити
          </Button>
        </Form>
      </Card>
    </>
  )
}