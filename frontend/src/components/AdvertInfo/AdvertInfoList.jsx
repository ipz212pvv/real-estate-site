import { Marker } from "@maptiler/sdk";
import { Badge, Divider, Flex, Space, Typography } from "antd";
import { MdOutlineBed } from "react-icons/md";
import { RiCustomSize } from "react-icons/ri";
import { PiStairs } from "react-icons/pi";

import { Map } from "@/components/common/Map.jsx";

import { ADVERT_PROPERTY_TYPES } from "@/config/constants.js";
import { arrayToString } from "@/utils/arrayToString.js";
import { AdvertLikeBtn } from "@/components/AdvertLikeBtn/AdvertLikeBtn.jsx";
import { ReportModal } from "@/components/ReportModal/ReportModal.jsx";

export function AdvertInfoList({ advert }) {
  const {
    id,
    title,
    price_usd,
    price_uah,
    area,
    room,
    floor,
    description,
    propertyTypeId,
    advertBenefitsForAdvert,
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

  const mapOptions = {
    center: [lon, lat],
    zoom: 17,
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
    <Space style={{ width: "100%", gap: 0, marginTop: 20 }} split={<Divider/>} direction="vertical">
      <div>
        <Flex align="center" justify="space-between">
          <Badge count={typeName} style={{ fontSize: 16, padding: "0 8px", backgroundColor: 'var(--ant-orange-6)' }} />
          <Space size="middle">
            <AdvertLikeBtn advertId={id}/>
            <ReportModal advertId={id} />
          </Space>
        </Flex>
        <Typography.Title level={2}>{title || propertyTypeName}</Typography.Title>
        <Typography.Text style={{ color: "var(--ant-color-text-secondary)" }} >{locationDisplay}</Typography.Text>
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
        <div style={{ width: "100%", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Map style={{ height: 400 }} onLoad={handleMapLoad} options={mapOptions} />
        </div>
      </div>
    </Space>
  )
}