import { Typography } from "antd";

import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";

export function Rent() {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>Оренда нерухомості</Typography.Title>
      <AdvertsMap/>
    </>
  )
}