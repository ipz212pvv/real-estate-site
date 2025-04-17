import { Button, Modal } from "antd";
import { IoClose } from "react-icons/io5";

import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

export function AdvertModal({ open, onClose, advert, loading }) {
	return (
		<Modal
			styles={{
				content: {
					paddingTop: 40,
					backgroundColor: "transparent",
					boxShadow: "none"
				}
			}}
			open={open}
			onCancel={onClose}
			loading={loading}
			closeIcon={
				<Button type="primary" icon={<IoClose size={24} />}/>
			}
			footer={null}
		>
			<AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
		</Modal>
	);
}