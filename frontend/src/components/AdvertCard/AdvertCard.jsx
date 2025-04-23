import { Link } from "react-router";
import { Badge, Divider, Flex, Space, Typography } from "antd";
import { MdOutlineBed } from "react-icons/md";
import { PiStairs } from "react-icons/pi";
import { RiCustomSize } from "react-icons/ri";

import { Tooltip } from "@/components/common/Tooltip.jsx";
import { AdvertLikeBtn } from "@/components/AdvertLikeBtn/AdvertLikeBtn.jsx";
import { ImageCarousel } from "@/components/ImageCarousel/ImageCarousel.jsx";

import styles from "./AdvertCard.module.css";
import { ADVERT_PROPERTY_TYPES } from "@/config/constants.js";
import { formatLocation } from "@/utils/format.js";

export function AdvertCard(props) {
	const { like = true, link, advert, actionSlot } = props;
	const {
		id,
		advertImages,
		price_usd,
		area,
		room,
		floor,
		propertyTypeId,
		locationForAdvert,
		advertPropertyTypeForAdvert: {
			name: propertyTypeName,
		}
	} = advert;

	const { building_levels } = locationForAdvert;
	const locationDisplay = formatLocation(locationForAdvert);

	const floorTooltip = propertyTypeId === ADVERT_PROPERTY_TYPES.HOUSE ? "Кількість поверхів" : "Поверх";
	const floorDisplay = propertyTypeId === ADVERT_PROPERTY_TYPES.FLAT && building_levels ? `${floor} з ${building_levels}` : floor;

	const pricePerMeter = Math.round(price_usd / area);
	const imageList = advertImages?.map(({ imageUrl }) => imageUrl);

	return (
		<Link to={link}>
			<div className={styles.card}>
				{actionSlot && (
					<Flex className={styles.actions} align="center" gap="small">
						{actionSlot}
					</Flex>
				)}
				<Badge.Ribbon placement="start" text={propertyTypeName}>
					<ImageCarousel images={imageList} />
				</Badge.Ribbon>
				<div className={styles["card-description"]}>
					<Flex gap="small" align="center">
						<Typography.Text strong style={{ fontSize: 24 }}>{price_usd} $</Typography.Text>
						<Typography.Text>{pricePerMeter} $ за м²</Typography.Text>
						{like && <AdvertLikeBtn advertId={id}/>}
					</Flex>
					<Typography.Text style={{ display: "flex", height: 50 }}>{locationDisplay}</Typography.Text>
					<Space
						styles={{ item: { flex: 1 } }}
						style={{ width: "100%", marginTop: 16 }}
		        split={<Divider className={styles.divider} type="vertical" />}
					>
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
				</div>
			</div>
		</Link>
	)
}
