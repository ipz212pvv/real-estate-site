import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { notification, Typography, Upload, Image } from "antd";
import { GoPlus } from "react-icons/go";

import { validateImageFormat, validateImageSize } from "@/utils/imageValidation.js";
import styles from "./AdvertImages.module.css";
import { MAX_ADVERT_IMAGE_SIZE } from "@/config/constants.js";
import { useDeleteAdvertImageMutation, useUploadAdvertImageMutation } from "@/store/services/advert-images.js";

export function AdvertImages({ initialImages }) {
	const { id } = useParams();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [fileList, setFileList] = useState(() => {
		return initialImages ? initialImages.map(({ id, imageUrl }) => ({
			uid: id,
			name: 'image.png',
			status: 'done',
			url: imageUrl,
		})) : [];
	});

	const [uploadImage, { error: uploadError }] = useUploadAdvertImageMutation();
	const [deleteImage, { error: deleteError }] = useDeleteAdvertImageMutation();

	const beforeUpload = file => {
		const isValidFormat = validateImageFormat(file);
		const isValidSize = validateImageSize(file, MAX_ADVERT_IMAGE_SIZE);

		return isValidFormat && isValidSize;
	};

	const handleUploadImage = ({ file, onSuccess, onError}) => {
		uploadImage({ advertId: id, image: file })
			.unwrap()
			.then(res => {
				const { id, imageUrl } = res;
				onSuccess(null, file);

				setFileList(prev => [
					...prev,
					{
						uid: id,
						name: 'image.png',
						status: 'done',
						url: imageUrl,
					}
				]);
			})
			.catch(onError);
	}

	const handleDeleteImage = ({ uid }) => {
		deleteImage({ advertId: id, imageId: uid })
			.unwrap()
			.then(() => setFileList(fileList.filter(({ uid: imageId }) => imageId !== uid)))
	}

	const handlePreview = async (file) => {
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	useEffect(() => {
		const error = uploadError || deleteError;

		if (error) {
			notification.error({
				message: "Помилка",
				description: error.message,
			});
		}
	}, [uploadError, deleteError]);

	return (
		<>
			<Upload
				className={styles.upload}
				accept="image/png, image/jpeg"
				fileList={fileList}
				listType="picture-card"
				customRequest={handleUploadImage}
				beforeUpload={beforeUpload}
				onPreview={handlePreview}
				onRemove={handleDeleteImage}
			>
				<GoPlus size={24} />
				<Typography.Text style={{ fontSize: 14, marginTop: 4 }}>
					Додати фото
				</Typography.Text>
			</Upload>
			{previewImage && (
				<Image
					wrapperStyle={{ display: 'none' }}
					src={previewImage}
					preview={{
						visible: previewOpen,
						toolbarRender: (_, { icons: { zoomInIcon, zoomOutIcon } }) => (
							<div className="ant-image-preview-operations">
								{zoomOutIcon}
								{zoomInIcon}
							</div>
						),
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
				/>
			)}
		</>
	)
}