import { Link } from "react-router";
import { Button, Card, Empty, Flex, Typography } from "antd";

import { Loading } from "@/components/common/Loading/Loading.jsx";

import { useGetUserAdvertsQuery } from "@/store/services/adverts.js";

export function ProfileAdverts() {
  const { data: adverts, isLoading } = useGetUserAdvertsQuery();

  if (isLoading) return <Loading />;

  return (
    <>
      <Flex gap="small" justify="space-between" align="center" wrap="wrap">
        <Typography.Title level={4} style={{ margin: 0 }}>Мої оголошення</Typography.Title>
        <Button type="primary" size="large">
          <Link to="/profile/adverts/create">
            Створити оголошення
          </Link>
        </Button>
      </Flex>
      <Card style={{ marginTop: 16 }}>
        {adverts.length > 0 ? (
          <div></div>
        ) : (
          <Empty description="Оголошення відсутні" />
        )}
      </Card>
    </>
  )
}