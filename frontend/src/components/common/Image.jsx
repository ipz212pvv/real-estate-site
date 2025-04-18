import { Image as AntdImage } from "antd";

import { IMAGE_FALLBACK } from "@/config/constants.js";

export function Image({ style = {}, ...props }) {
  return (
    <AntdImage
      style={{ display: "inline-block", objectFit: "cover", ...style }}
      preview={false}
      fallback={IMAGE_FALLBACK}
      {...props}
    />
  )
}