import { message } from "antd";
import { AVAILABLE_IMAGE_TYPES } from "@/config/constants.js";
import { formatBytes } from "@/utils/formatBytes.js";

export function validateImageFormat(file) {
	const isValidFormat = AVAILABLE_IMAGE_TYPES.includes(file.type);

	if (!isValidFormat) {
		message.error('Доступні формати фото PNG, JPG або JPEG');
	}

	return isValidFormat;
}

export function validateImageSize(file, size) {
	const isValidSize = file.size <= size;

	if (!isValidSize) {
		message.error(`Максимальний розмір фото ${formatBytes(size, 0)}`);
	}

	return isValidSize;
}