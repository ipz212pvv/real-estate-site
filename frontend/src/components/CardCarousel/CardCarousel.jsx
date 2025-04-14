import { Carousel } from "@/components/common/Carousel/Carousel.jsx";

import styles from "./CardCarousel.module.css";
import { AdvertCard } from "@/components/AdvertCard/AdvertCard.jsx";

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
        <AdvertCard
          link="/"
          key={i}
          advert={{
            id: 1,
            image: "https://cdn.riastatic.com/photos/dom/photo/31350/3135037/313503780/313503780fm.webp",
            price_usd: 80000,
            area: 40,
            room: 2,
            floor: 2,
            propertyTypeId: 1,
            locationForAdvert: {
              city: "Житомир",
              road: "Андріївська",
              house_number: 36,
              building_levels: 10
            },
            advertPropertyTypeForAdvert: {
              name: "Будинок"
            }
          }}
        />
      ))}
    </Carousel>
  )
}