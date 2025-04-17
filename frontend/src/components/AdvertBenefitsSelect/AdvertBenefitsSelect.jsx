import { useParams } from "react-router";
import { useEffect, useMemo } from "react";
import { notification, Select } from "antd";

import { useAddAdvertBenefitMutation, useDeleteAdvertBenefitMutation } from "@/store/services/advert-benefits.js";

export function AdvertBenefitsSelect({ initialValue = [], options }) {
	const { id } = useParams();

	const defaultValue = useMemo(() => initialValue.map(({ benefitId }) => benefitId), [initialValue]);

	const [addBenefit, { error: addError }] = useAddAdvertBenefitMutation();
	const [deleteBenefit, { error: deleteError }] = useDeleteAdvertBenefitMutation();

	const handleSelect = (value) => {
		addBenefit({ advertId: id, benefitId: value })
	};

	const handleDeselect = (value) => {
		const { id: advertBenefitId } = initialValue.find(({ benefitId }) => benefitId === value);
		deleteBenefit({ advertId: id, advertBenefitId })
	}

	useEffect(() => {
		const error = addError || deleteError;

		if (error) {
			notification.error({
				message: "Помилка",
				description: error.message,
			});
		}
	}, [addError, deleteError]);

	return (
		<Select
			mode="multiple"
			style={{ width: '100%' }}
			placeholder="Виберіть переваги"
			onSelect={handleSelect}
			onDeselect={handleDeselect}
			defaultValue={defaultValue}
			options={options}
		/>
	)
}