import { Badge, Card, Col, Divider, Flex, Row, Space, Typography } from "antd";
import { gray } from "@ant-design/colors";
import { Link } from "react-router";
import { MdOutlineBed } from "react-icons/md";
import { RiCustomSize } from "react-icons/ri";
import { PiStairs } from "react-icons/pi";

import { Tooltip } from "@/components/common/Tooltip.jsx";
import { AdvertLikeBtn } from "@/components/AdvertLikeBtn/AdvertLikeBtn.jsx";
import { ImageCarousel } from "@/components/ImageCarousel/ImageCarousel.jsx";

import { formatDate } from "@/utils/dateFormat.js";
import styles from "./AdvertBar.module.css";
import { arrayToString } from "@/utils/arrayToString.js";

export function AdvertBar(props) {
  const { like = true, link, advert } = props;
  const {
    advertImages,
    price_usd,
    area,
    room,
    floor,
    propertyTypeId,
    description,
    createdAt,
    locationForAdvert: {
      state,
      district,
      city,
      road,
      house_number,
      building_levels
    },
    advertPropertyTypeForAdvert: {
      name: propertyTypeName,
    }
  } = advert;

  const streetName = road?.replace(new RegExp("(вулиця )|( вулиця)", "g"), "");
  const streetDisplay = streetName ? `вул. ${streetName}` : "";

  const locationDisplay = city
    ? arrayToString([city, streetDisplay, house_number])
    : arrayToString([state, district])

  const floorTooltip = propertyTypeId === 2 ? "Кількість поверхів" : "Поверх";
  const floorDisplay = building_levels ? `${floor} з ${building_levels}` : floor;

  const pricePerMeter = Math.round(price_usd / area);

  const imageList = advertImages.map(({ imageUrl }) => imageUrl);

  return (
    <Link to={link}>
      <Card styles={{ body: { padding: 0 } }} hoverable>
        <Row>
          <Col className={styles["slider-col"]} xs={{ span: 24 }} md={{ flex: "400px" }}>
            <Badge.Ribbon rootClassName={styles["image-wrapper"]} placement="start" text={propertyTypeName}>
              <ImageCarousel images={imageList} />
            </Badge.Ribbon>
          </Col>
          <Col xs={{ span: 24 }} md={{ flex: "1 0 350px" }}>
            <Flex style={{ padding: "8px 16px" }} gap="small" vertical>
              <Flex gap="small" align="center">
                <Typography.Text strong style={{ fontSize: 24 }}>{price_usd} $</Typography.Text>
                <Typography.Text>{pricePerMeter} $ за м²</Typography.Text>
                {like && <AdvertLikeBtn />}
              </Flex>
              <Typography.Text strong>{locationDisplay}</Typography.Text>
              {description && (
                <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 4 }}>
                  {description}
                </Typography.Paragraph>
              )}
              <Space split={<Divider className={styles.divider} type="vertical" />}>
                {room && (
                  <Tooltip size="small" title="Кімнати" color="orange">
                    <Flex justify="center" align="center" gap="small">
                      <MdOutlineBed color="var(--ant-orange-6)" size={20}/>
                      {room}
                    </Flex>
                  </Tooltip>
                )}
                <Tooltip size="small" title="Площа" color="orange">
                  <Flex justify="center" align="center" gap="small">
                    <RiCustomSize color="var(--ant-orange-6)" size={20}/>
                    {area} м²
                  </Flex>
                </Tooltip>
                {floor && (
                  <Tooltip size="small" title={floorTooltip} color="orange">
                    <Flex justify="center" align="center" gap="small">
                      <PiStairs color="var(--ant-orange-6)" size={20}/>
                      {floorDisplay}
                    </Flex>
                  </Tooltip>
                )}
              </Space>
              <Typography.Text style={{ fontSize: 14, color: gray[1] }}>
                Опубліковано {formatDate("DD.MM.YYYY HH:MM", new Date(createdAt))}
              </Typography.Text>
            </Flex>
          </Col>
        </Row>
      </Card>
    </Link>
  )
}