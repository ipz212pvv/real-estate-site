import { Button, Empty, Flex, Typography } from "antd";

import { Loading } from "@/components/common/Loading/Loading.jsx";

import { useGetUserAdvertsQuery } from "@/store/services/adverts.js";

export function ProfileAdverts() {
  const { data: adverts, isLoading } = useGetUserAdvertsQuery();

  if (isLoading) return <Loading />;

  return (
    <>
      <Flex gap="small" justify="space-between" align="center" wrap="wrap">
        <Typography.Title level={4} style={{ margin: 0 }}>Мої оголошення</Typography.Title>
        <Button type="primary" size="large">Створити оголошення</Button>
      </Flex>
      {adverts.length > 0 ? (
        <div></div>
      ) : (
        <Empty description="Оголошення відсутні" />
      )}
    </>
  )
}