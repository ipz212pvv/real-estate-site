import { useState } from "react";
import { useParams } from "react-router";
import {
	Card,
	Col,
	Divider,
	Flex,
	Row,
	Typography,
	Badge, Empty,
} from "antd";
import { HomeOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";

import { AdvertCard } from "@/components/AdvertCard/AdvertCard";
import { Avatar } from "@/components/common/Avatar.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";

import { useGetUserByIdQuery } from "@/store/services/users.js";

const { Title, Text } = Typography;

export function AccountView() {
	const { id } = useParams();
	const { data: user, isLoading, error } = useGetUserByIdQuery(id);
	const [adverts] = useState([]);

	if (isLoading) return <Loading/>;
	if (error) return <NotFound/>;

	const { name, surname, image, phone, createdAt, userType } = user;

	const phoneNumber = `+38${phone}`;
	const createdAtData = new Date(createdAt).toLocaleDateString();

	return (
		<>
			<Row gutter={[24, 24]}>
				<Col xs={24} md={8}>
					<Badge.Ribbon placement="start" text={userType.name}>
						<Card>
							<Flex vertical align="center" gap={16}>
								<Avatar src={image} size={120} />
								<Title level={3} style={{ marginBottom: 0 }}>{name} {surname}</Title>

								<Divider style={{ margin: "16px 0" }} />

								<Flex vertical style={{ width: "100%" }} gap={12}>
									<Flex align="center" gap={8}>
										<PhoneOutlined />
										<Text>{phoneNumber}</Text>
									</Flex>
									<Flex align="center" gap={8}>
										<CalendarOutlined />
										<Text>На сайті з {createdAtData}</Text>
									</Flex>
									<Flex align="center" gap={8}>
										<HomeOutlined />
										<Text>{"0"} об'єктів нерухомості</Text>
									</Flex>
								</Flex>
							</Flex>
						</Card>
					</Badge.Ribbon>
				</Col>

				<Col xs={24} md={16}>
					<Card title="Активні оголошення">
						<Row gutter={[16, 16]}>
							{adverts.length > 0 ? (
								adverts.map(advert => (
									<Col xs={24} sm={12} key={advert.id}>
										<AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
									</Col>
								))
							) : (
								<Empty style={{ margin: "0 auto" }} description="Оголошення відсутні" />
							)}
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
}
