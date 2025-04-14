import { Fragment } from "react";

import { Carousel } from "@/components/common/Carousel/Carousel.jsx";
import { Image } from "@/components/common/Image.jsx";

import styles from "./ImageCarousel.module.css";

export function ImageCarousel({ images, props }) {

  if (images.length === 0) {
    images.push(null);
  }

  return (
    <Carousel className={styles.carousel} infinite={false} {...props}>
      {images.map((src, i) => (
        <Fragment key={i}>
          <Image src={src} width="100%" style={{ aspectRatio: "4 / 2.8" }} />
        </Fragment>
      ))}
    </Carousel>
  )
}