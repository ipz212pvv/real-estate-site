import { Tooltip as AntdTooltip } from "antd";

export function Tooltip({ size, styles = {}, ...props }) {
  if (size === "small") {
    styles.body = {
      minHeight: "auto",
      padding: "6px 8px",
      fontSize: 14,
      lineHeight: 1,
    }
  }

  return (
    <AntdTooltip styles={styles} {...props}/>
  )
}