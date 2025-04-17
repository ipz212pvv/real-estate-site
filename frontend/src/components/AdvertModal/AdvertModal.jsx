import { Modal } from "antd";

import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

import styles from "./AdvertModal.module.css";

export function AdvertModal({ open, onClose, advert, loading }) {
	return (
		<Modal
			className={styles.modal}
			classNames={{ content: styles["modal-content"] }}
			open={open}
			onCancel={onClose}
			loading={loading}
			footer={null}
		>
			<AdvertCard link={`/adverts/${advert.id}`} advert={advert} />
		</Modal>
	);
}