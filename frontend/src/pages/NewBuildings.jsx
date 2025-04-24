import { Flex, Typography } from "antd";

import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";
import { AdvertsFilter } from "@/components/AdvertsFilter/AdvertsFilter.jsx";

export default function NewBuildings() {
  return (
    <>
      <Flex justify="space-between">
        <Typography.Title level={2} style={{ textAlign: "center" }}>Новобудови</Typography.Title>
        <AdvertsFilter/>
      </Flex>
      <AdvertsMap/>
    </>
  )
}