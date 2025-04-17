import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NextArrow, PrevArrow } from "@/components/common/Carousel/Arrows.jsx";

import styles from "./Carousel.module.css";

export function Carousel({ children, className, ...props }) {

  const classNames = [styles.carousel, className].join(' ');

  return (
    <Slider
      className={classNames}
      speed={300}
      nextArrow={<NextArrow />}
      prevArrow={<PrevArrow />}
      {...props}
    >
      {children}
    </Slider>
  );
}