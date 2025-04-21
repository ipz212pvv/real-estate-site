import { Link } from "react-router";
import { Button, Card, Divider, Flex, Typography } from "antd";

import { Avatar } from "@/components/common/Avatar.jsx";

import { gray } from "@ant-design/colors";
import { formatDate } from "@/utils/dateFormat.js";

export function AdvertSellerCard({ seller, createdAt }) {
  const { id, userType, image, name, surname } = seller;

  const sellerPhone = `+38${seller?.phone}`;
  const createdAtDate = formatDate("DD.MM.YYYY HH:MM", new Date(createdAt))

  return (
    <Card
      size="small"
      title={userType?.name}
      style={{
        position: "sticky",
        top: 20,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Flex gap="middle" align="center">
        <Avatar src={image} size={50} />
        <Flex vertical>
          <Link to={`/accounts/${id}`}>
            <Button style={{ fontWeight: "bold", padding: 4 }}  type="text">
              {name} {surname}
            </Button>
          </Link>
          {seller?.phone && <Typography.Text style={{ color: gray[2] }} copyable>{sellerPhone}</Typography.Text>}
        </Flex>
      </Flex>
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Text style={{ fontSize: 14, color: gray[2] }}>Опубліковано {createdAtDate}</Typography.Text>
    </Card>
  )
}