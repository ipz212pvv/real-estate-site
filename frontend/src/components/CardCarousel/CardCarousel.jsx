import { Link } from "react-router";
import { Button, Divider, Flex, Tooltip, Typography } from "antd";
import { FiHeart } from "react-icons/fi";
import { MdOutlineBed } from "react-icons/md";
import { PiStairs } from "react-icons/pi";
import { RiCustomSize } from "react-icons/ri";

import { Carousel } from "@/components/common/Carousel.jsx";
import { Image } from "@/components/common/Image.jsx";

import styles from "./CardCarousel.module.css";

const { Text } = Typography;

export function CardCarousel({ items }) {
  return (
    <Carousel
      className={styles.carousel}
      infinite={false}
      speed={300}
      slidesToShow={3}
      responsive={[
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            arrows: false,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            arrows: false,
          }
        }
      ]}
    >
      {[...Array(9)].map((_, i) => (
        <Link to="/" key={i}>
          <div className={styles.card}>
            <Image src="https://cdn.riastatic.com/photos/dom/photo/31350/3135037/313503780/313503780fm.webp" style={{ aspectRatio: "4 / 2.8", borderRadius: "8px 8px 0 0" }} />
            <div className={styles["card-description"]}>
              <Flex gap="small" align="center">
                <Text strong style={{ fontSize: 24 }}>80000 $</Text>
                <Text>700 $ за м²</Text>
                <Button className={styles["like-btn"]} size="small" type="text">
                  <FiHeart size={24} />
                </Button>
              </Flex>
              <Flex gap="small" align="center">
                <Text>Житомир</Text>
                <Text>вул. Андріївська 36</Text>
              </Flex>
              <Flex style={{ marginTop: 16, color: 'initial' }} gap="small" align="center">
                <Tooltip classNames={{ body: styles["tooltip-body"] }} title="Кімнати" color="orange">
                  <Flex style={{ flex: 1 }} justify="center" align="center" gap="small"><MdOutlineBed color="var(--ant-orange-6)" size={20}/> 4</Flex>
                </Tooltip>
                <Divider style={{ height: 16, borderColor: 'rgba(0,0,0,0.2)' }} type="vertical" />
                <Tooltip classNames={{ body: styles["tooltip-body"] }} title="Площа" color="orange">
                  <Flex style={{ flex: 1 }} justify="center" align="center" gap="small"><RiCustomSize color="var(--ant-orange-6)" size={20}/> 30 м²</Flex>
                </Tooltip>
                <Divider style={{ height: 16, borderColor: 'rgba(0,0,0,0.2)' }} type="vertical" />
                <Tooltip classNames={{ body: styles["tooltip-body"] }} title="Поверх" color="orange">
                  <Flex style={{ flex: 1 }} justify="center" align="center" gap="small"><PiStairs color="var(--ant-orange-6)" size={20}/> 3</Flex>
                </Tooltip>
              </Flex>
            </div>
          </div>
        </Link>
      ))}
    </Carousel>
  )
}