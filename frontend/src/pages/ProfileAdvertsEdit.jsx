import { useNavigate, useParams } from "react-router";
import { Card, notification, Typography } from "antd";

import { AdvertForm } from "@/components/AdvertForm/AdvertForm.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";

import { useEditAdvertMutation, useGetAdvertByIdQuery } from "@/store/services/adverts.js";

export function ProfileAdvertsEdit() {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data, isLoading } = useGetAdvertByIdQuery(id);
	const [editAdvert] = useEditAdvertMutation();

	const onFinish = (formData, onFinal) => {
		editAdvert({ advertId: id, data: formData })
			.unwrap()
			.then(() => navigate(`/profile/adverts`))
			.catch(err => {
				notification.error({
					message: "Помилка",
					description: err.message,
				})
			})
			.finally(onFinal);
	};

	if (isLoading) return <Loading/>

	const {
		title,
		typeId,
		propertyTypeId,
		price_usd,
		area,
		room,
		floor,
		description,
		locationForAdvert: {
			lat,
			lon
		},
		advertImages
	} = data;

	const initialFormValue = {
		title,
		typeId,
		propertyTypeId,
		price: price_usd,
		area,
		room,
		floor,
		description,
		location: {
			lat,
			lng: lon
		},
		images: advertImages
	}

	return (
		<>
			<Typography.Title level={4} style={{ margin: 0 }}>Редагування оголошення</Typography.Title>
			<Card style={{ marginTop: 16 }}>
				<AdvertForm initialFormValue={initialFormValue} onFinish={onFinish} submitBtnName="Зберегти" edit />
			</Card>
		</>
	)
}