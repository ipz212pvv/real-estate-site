import { useNavigate, useParams, useSearchParams } from "react-router";
import { Card, notification, Typography } from "antd";

import { AdvertForm } from "@/components/AdvertForm/AdvertForm.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";

import { useEditAdvertMutation, useGetAdvertByIdQuery } from "@/store/services/adverts.js";

export function ProfileAdvertsEdit() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [searchParams] = useSearchParams();

	const { data, isLoading, error } = useGetAdvertByIdQuery(id);
	const [editAdvert] = useEditAdvertMutation();

	const onFinish = (formData, onFinal) => {
		const redirectTo = searchParams.get("redirectTo");

		editAdvert({ advertId: id, data: formData })
			.unwrap()
			.then(() => navigate(redirectTo || `/profile/adverts`))
			.catch(err => {
				notification.error({
					message: "Помилка",
					description: err.message,
				})
			})
			.finally(onFinal);
	};

	if (isLoading) return <Loading />
	if (error) return <NotFound />

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
		advertImages,
		advertBenefitsForAdvert
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
		images: advertImages,
		benefits: advertBenefitsForAdvert
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