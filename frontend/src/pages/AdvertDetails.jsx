import { Marker } from "@maptiler/sdk";
import { useParams } from "react-router";
import { Badge, Card, Col, Divider, Flex, Row, Space, Typography } from "antd";
import { MdOutlineBed } from "react-icons/md";
import { PiStairs } from "react-icons/pi";
import { RiCustomSize } from "react-icons/ri";
import { gray } from "@ant-design/colors";

import { ImageCarousel } from "@/components/ImageCarousel/ImageCarousel.jsx";
import { Map } from "@/components/common/Map.jsx";
import { Image } from "@/components/common/Image.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";

import { useGetAdvertByIdQuery } from "@/store/services/adverts.js";
import { arrayToString } from "@/utils/arrayToString.js";
import { ADVERT_PROPERTY_TYPES, AVATAR_FALLBACK } from "@/config/constants.js";
import styles from "./AdvertDetail.module.css";
import { formatDate } from "@/utils/dateFormat.js";

export function AdvertDetails() {
  const { id } = useParams();
  const { data: advert, isLoading, error } = useGetAdvertByIdQuery(id);

  if (isLoading) return <Loading/>

  if (error) return <NotFound />

  const {
    title,
    advertImages,
    price_usd,
    price_uah,
    area,
    room,
    floor,
    description,
    createdAt,
    propertyTypeId,
    advertBenefitsForAdvert,
    userOfAdvert: seller,
    locationForAdvert: {
      state,
      district,
      city,
      road,
      house_number,
      building_levels,
      lat,
      lon
    },
    advertPropertyTypeForAdvert: {
      name: propertyTypeName,
    },
    advertTypeForAdvert: {
      name: typeName,
    },
  } = advert;

  const streetName = road?.replace(new RegExp("(вулиця )|( вулиця)", "g"), "");
  const streetDisplay = streetName ? `вул. ${streetName}` : "";
  const locationDisplay = city
    ? arrayToString([city, streetDisplay, house_number])
    : arrayToString([state, district]);

  const floorLabel = propertyTypeId === ADVERT_PROPERTY_TYPES.HOUSE ? "Кількість поверхів" : "Поверх";
  const floorDisplay = propertyTypeId === ADVERT_PROPERTY_TYPES.FLAT && building_levels ? `${floor} з ${building_levels}` : floor;

  const pricePerMeter = Math.round(price_usd / area);
  const imageList = advertImages?.map(({ imageUrl }) => imageUrl);

  const sellerPhone = `+38${seller.phone}`;

  const mapOptions = {
    center: [lon, lat],
    zoom: 16,
    pitch: 60,
  }

  const handleMapLoad = (mapInstance) => {
    new Marker({
      color: "#f4801a",
    })
    .setLngLat([lon, lat])
    .addTo(mapInstance);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Badge.Ribbon placement="start" text={propertyTypeName}>
          <div className={styles.carousel}>
            <ImageCarousel
              imageProps={{
                preview: {
                  toolbarRender: (_, { icons: { zoomInIcon, zoomOutIcon } }) => (
                    <div className="ant-image-preview-operations">
                      {zoomOutIcon}
                      {zoomInIcon}
                    </div>
                  )
                }
              }}
              imageStyle={{ maxHeight: 550, height: "100%", objectFit: "contain" }}
              images={imageList}
            />
          </div>
        </Badge.Ribbon>

        <Space style={{ width: "100%", gap: 0, marginTop: 20 }} split={<Divider/>} direction="vertical">
          <div>
            <Badge count={typeName} style={{ fontSize: 16, padding: "0 8px", backgroundColor: 'var(--ant-orange-6)' }} />
            <Typography.Title level={2}>{title || propertyTypeName}</Typography.Title>
            <Typography.Text>{locationDisplay}</Typography.Text>
          </div>

          <Flex gap="large">
            <div>
              <Typography.Title level={3}>{price_usd.toLocaleString()} $</Typography.Title>
              <Typography.Text type="secondary">{price_uah.toLocaleString()} грн</Typography.Text>
            </div>
            <div>
              <Typography.Title level={4}>{pricePerMeter.toLocaleString()} $ за м²</Typography.Title>
            </div>
          </Flex>

          <div>
            <Typography.Title level={4}>Характеристики</Typography.Title>
            <Space size="large" wrap>
              {room && (
                <Flex justify="center" align="center" gap="small">
                  <MdOutlineBed color="var(--ant-orange-6)" size={24}/>
                  Кімнати:
                  <Typography.Text strong>{room}</Typography.Text>
                </Flex>
              )}
              <Flex justify="center" align="center" gap="small">
                <RiCustomSize color="var(--ant-orange-6)" size={24}/>
                Площа:
                <Typography.Text strong>{area} м²</Typography.Text>
              </Flex>
              {floor && (
                <Flex justify="center" align="center" gap="small">
                  <PiStairs color="var(--ant-orange-6)" size={24}/>
                  {floorLabel}:
                  <Typography.Text strong>{floorDisplay}</Typography.Text>
                </Flex>
              )}
            </Space>
          </div>

          {advertBenefitsForAdvert.length > 0 && (
            <div>
              <Typography.Title level={4}>Переваги</Typography.Title>
              <Flex gap="small" wrap>
                {advertBenefitsForAdvert.map(({ id, benefitForAdvert }) => (
                  <Badge key={id} count={benefitForAdvert.name} style={{ fontSize: 16, backgroundColor: 'var(--ant-orange-6)' }} />
                ))}
              </Flex>
            </div>
          )}

          {description && (
            <div>
              <Typography.Title level={4}>Опис</Typography.Title>
              <Typography.Paragraph style={{ marginBottom: 0 }}>{description}</Typography.Paragraph>
            </div>
          )}

          <div>
            <Typography.Title level={4}>Розташування на карті</Typography.Title>
            <div className={styles.map}>
              <Map style={{ height: 400 }} onLoad={handleMapLoad} options={mapOptions} />
            </div>
          </div>
        </Space>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          size="small"
          title={seller.userType.name}
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
              src={seller.image}
              fallback={AVATAR_FALLBACK}
            />
            <Flex vertical>
              <Typography.Text style={{ fontSize: 16 }} strong ellipsis>{seller.name} {seller.surname}</Typography.Text>
              <Typography.Text style={{ color: gray[2] }} copyable>{sellerPhone}</Typography.Text>
            </Flex>
          </Flex>
          <Divider style={{ margin: "8px 0" }} />
          <Typography.Text style={{ fontSize: 14, color: gray[2] }}>Опубліковано {formatDate("DD.MM.YYYY HH:MM", new Date(createdAt))}</Typography.Text>
        </Card>
      </Col>
    </Row>
  );
}