import { Empty, Flex } from "antd";

import { AdvertBar } from "@/components/AdvertBar/AdvertBar.jsx";

export function AdvertList({ adverts = [] }) {

  return (
    adverts.length > 0 ? (
      <Flex gap="middle" vertical>
        {adverts.map(advert => (
          <AdvertBar
            key={advert.id}
            link={`/adverts/${advert.id}`}
            advert={advert}
          />
        ))}
      </Flex>
    ) : (
      <Empty description="Оголошення відсутні" />
    )
  )
}