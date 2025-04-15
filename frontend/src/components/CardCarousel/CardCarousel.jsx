import { Carousel } from "@/components/common/Carousel/Carousel.jsx";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

import styles from "./CardCarousel.module.css";

export function CardCarousel({ items }) {
  return (
    <Carousel
      className={`card-carousel ${styles.carousel}`}
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
      {items.map((advert, i) => (
        <AdvertCard
          link={`/adverts/${advert.id}`}
          key={i}
          advert={advert}
        />
      ))}
    </Carousel>
  )
}