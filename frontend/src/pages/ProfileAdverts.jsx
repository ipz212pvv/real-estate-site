import { Link, useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { Button, Card, Col, Empty, Flex, notification, Popconfirm, Row, Typography } from "antd";

import { Loading } from "@/components/common/Loading/Loading.jsx";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

import { useDeleteAdvertMutation, useGetUserAdvertsQuery } from "@/store/services/adverts.js";

export function ProfileAdverts() {
  const navigate = useNavigate();
  const { data: advertsResponse, isLoading } = useGetUserAdvertsQuery();
  const [deleteAdvert] = useDeleteAdvertMutation();

  const handleDelete = (id) => {
      deleteAdvert(id)
      .unwrap()
      .catch(err => {
        notification.error({
          message: "Помилка",
          description: err.message,
        })
      });
  }

  const handleEdit = (e, id) => {
    e.preventDefault();

    navigate(`/profile/adverts/${id}/edit`);
  }

  if (isLoading) return <Loading />;

  const { adverts } = advertsResponse

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
          <Row gutter={16}>
            {adverts.map(advert => (
              <Col xs={24} md={12} lg={8} key={advert.id}>
                <AdvertCard
                  advert={advert}
                  link={`/adverts/${advert.id}`}
                  like={false}
                  actionSlot={
                    <>
                      <Button onClick={(e) => handleEdit(e, advert.id)} icon={<LuPencil/>} />
                      <Popconfirm
                        title="Видалити оголошення"
                        description="Ви дійсно бажаєте видалити оголошення?"
                        onPopupClick={(e) => e.preventDefault()}
                        onConfirm={() => handleDelete(advert.id)}
                      >
                        <Button onClick={(e) => e.preventDefault()} icon={<FaTrash/>} danger/>
                      </Popconfirm>
                    </>
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Оголошення відсутні" />
        )}
      </Card>
    </>
  )
}