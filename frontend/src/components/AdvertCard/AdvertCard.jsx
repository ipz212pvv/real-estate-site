import { Link } from "react-router";
import { Badge, Button, Divider, Flex, Space, Tooltip, Typography } from "antd";
import { FiHeart } from "react-icons/fi";
import { MdOutlineBed } from "react-icons/md";
import { PiStairs } from "react-icons/pi";
import { RiCustomSize } from "react-icons/ri";

import { Image } from "@/components/common/Image.jsx";

import styles from "./AdvertCard.module.css";
import { arrayToString } from "@/utils/arrayToString.js";

export function AdvertCard(props) {
	const { like = true, link, advert, actionSlot } = props;
	const {
		image,
		price_usd,
		area,
		room,
		floor,
		propertyTypeId,
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

	return (
		<Link to={link}>
			<div className={styles.card}>
				{actionSlot && (
					<Flex className={styles.actions} align="center" gap="small">
						{actionSlot}
					</Flex>
				)}
				<Badge.Ribbon placement="start" text={propertyTypeName}>
					<Image src={image} style={{ aspectRatio: "4 / 2.8", borderRadius: "8px 8px 0 0" }} />
				</Badge.Ribbon>
				<div className={styles["card-description"]}>
					<Flex gap="small" align="center">
						<Typography.Text strong style={{ fontSize: 24 }}>{price_usd} $</Typography.Text>
						<Typography.Text>{pricePerMeter} $ за м²</Typography.Text>
						{like && (
							<Button className={styles["like-btn"]} size="small" type="text">
								<FiHeart size={24} />
							</Button>
						)}
					</Flex>
					<Typography.Text style={{ display: "flex", height: 50 }}>{locationDisplay}</Typography.Text>
					<Space
						styles={{ item: { flex: 1 } }}
						style={{ width: "100%", marginTop: 16 }}
		        split={<Divider className={styles.divider} type="vertical" />}
					>
						{room && (
							<Tooltip classNames={{ body: styles["tooltip-body"] }} title="Кімнати" color="orange">
								<Flex justify="center" align="center" gap="small">
									<MdOutlineBed color="var(--ant-orange-6)" size={20}/>
									{room}
								</Flex>
							</Tooltip>
						)}
						<Tooltip classNames={{ body: styles["tooltip-body"] }} title="Площа" color="orange">
							<Flex justify="center" align="center" gap="small">
								<RiCustomSize color="var(--ant-orange-6)" size={20}/>
								{area} м²
							</Flex>
						</Tooltip>
						{floor && (
							<Tooltip classNames={{ body: styles["tooltip-body"] }} title={floorTooltip} color="orange">
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