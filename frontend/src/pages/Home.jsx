import { Empty, Flex, Typography } from "antd";

import { HeroCards } from "@/components/HeroCards/HeroCards.jsx";
import { CardCarousel } from "@/components/CardCarousel/CardCarousel.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";

import { useGetLastAdvertsQuery } from "@/store/services/adverts.js";

export function Home() {
  const { data, isLoading } = useGetLastAdvertsQuery();

  if (isLoading) return <Loading />

  return (
    <Flex gap="middle" vertical>
      <HeroCards />
      <div style={{ paddingTop: "20px" }}>
        <Typography.Title style={{ fontWeight: "bold" }} level={2}>Останні пропозиції</Typography.Title>
        {data?.adverts.length > 0 ? (
          <CardCarousel items={data?.adverts} />
        ) : (
          <Empty description="Оголошення відсутні" />
        ) }
      </div>
    </Flex>
  )
}