import { Flex, Typography } from "antd";

import { AdvertsFilter } from "@/components/AdvertsFilter/AdvertsFilter.jsx";
import { AdvertsMap } from "@/components/AdvertsMap/AdvertsMap.jsx";

export function Buy() {
  return (
    <>
      <Flex justify="space-between">
        <Typography.Title level={2}>Купівля нерухомості</Typography.Title>
        <AdvertsFilter/>
      </Flex>
      <AdvertsMap/>
    </>
  )
}