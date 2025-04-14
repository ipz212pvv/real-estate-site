import { Typography } from "antd";

import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";

export function Buy() {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>Купівля нерухомості</Typography.Title>
      <AdvertsMap/>
    </>
  )
}