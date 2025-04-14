import { Typography } from "antd";

import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";

export function NewBuildings() {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>Новобудови</Typography.Title>
      <AdvertsMap/>
    </>
  )
}