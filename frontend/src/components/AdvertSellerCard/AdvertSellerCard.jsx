import { Card, Divider, Flex, Typography } from "antd";
import { Image } from "@/components/common/Image.jsx";

import { AVATAR_FALLBACK } from "@/config/constants.js";
import { gray } from "@ant-design/colors";
import { formatDate } from "@/utils/dateFormat.js";

export function AdvertSellerCard({ seller, createdAt }) {
  const { userType, image, name, surname } = seller;

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
        <Image
          style={{ flex: "0 0 auto", minWidth: 50, borderRadius: "50px" }}
          width={50}
          height={50}
          src={image}
          fallback={AVATAR_FALLBACK}
        />
        <Flex vertical>
          <Typography.Text style={{ fontSize: 16 }} strong ellipsis>{name} {surname}</Typography.Text>
          {seller?.phone && <Typography.Text style={{ color: gray[2] }} copyable>{sellerPhone}</Typography.Text>}
        </Flex>
      </Flex>
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Text style={{ fontSize: 14, color: gray[2] }}>Опубліковано {createdAtDate}</Typography.Text>
    </Card>
  )
}