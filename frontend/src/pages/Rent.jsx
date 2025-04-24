import { Flex, Typography } from "antd";

import { AdvertsFilter } from "@/components/AdvertsFilter/AdvertsFilter.jsx";
import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";

export default function Rent() {
  return (
    <>
      <Flex justify="space-between">
        <Typography.Title level={2}>Оренда нерухомості</Typography.Title>
        <AdvertsFilter/>
      </Flex>
      <AdvertsMap/>
    </>
  )
}
