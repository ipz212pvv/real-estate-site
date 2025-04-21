import { Image } from "@/components/common/Image.jsx";

import { AVATAR_FALLBACK } from "@/config/constants.js";

export function Avatar({ style, size = 50, ...props }) {
	return (
		<Image
			style={{ flex: "0 0 auto", minWidth: size, borderRadius: "50px", ...style }}
			width={size}
			height={size}
			fallback={AVATAR_FALLBACK}
			{...props}
		/>
	)
}