import { Select } from "antd";

export function AdvertBenefitsSelect({ benefits }) {
	const options = [];

	const handleChange = (value) => {
		console.log(`selected ${value}`);
	};

	return (
		<Select
			mode="multiple"
			style={{ width: '100%' }}
			placeholder="Виберіть переваги"
			onChange={handleChange}
			options={options}
		/>
	)
}