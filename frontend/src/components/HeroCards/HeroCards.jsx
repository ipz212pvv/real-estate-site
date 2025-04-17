import { Link } from "react-router";
import { Card, Flex, Typography } from "antd";

import { Apartment, ForSale, Rent } from "@/components/icons";

import styles from "./HeroCards.module.css";
import { ADVERT_TYPES } from "@/config/constants.js";

const { Title } = Typography;

const CARDS = [
  {
    label: "Купівля",
    icon: <ForSale/>,
    path: `/buy?typeId=${ADVERT_TYPES.SELL}`
  },
  {
    label: "Оренда",
    icon: <Rent/>,
    path: `/rent?typeId=${ADVERT_TYPES.RENT}`
  },
  {
    label: "Новобудови",
    icon: <Apartment/>,
    path: `/new-buildings?typeId=${ADVERT_TYPES.NEW_BUILDING}`
  }
]

export function HeroCards() {
  return (
    <Flex style={{ flex: "1" }} justify="center" gap="middle" wrap>
      {CARDS.map(({ label, icon, path }, i) => (
        <Link style={{ flex: "1 1 250px" }} to={path} key={i}>
          <Card hoverable classNames={{ body: styles["card-body"] }}>
            <Title level={4} style={{ margin: 0 }}>{label}</Title>
            {icon}
          </Card>
        </Link>
      ))}
    </Flex>
  )
}