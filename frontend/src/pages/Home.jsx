import { Flex, Typography } from "antd";
import { HeroCards } from "@/components/HeroCards/HeroCards.jsx";
import { CardCarousel } from "@/components/CardCarousel/CardCarousel.jsx";

export function Home() {
  return (
    <Flex gap="middle" vertical>
      <HeroCards />
      <div style={{ paddingTop: "20px" }}>
        <Typography.Title style={{ fontWeight: "bold" }} level={2}>Останні пропозиції</Typography.Title>
        <CardCarousel/>
      </div>
    </Flex>
  )
}