import { Button } from "antd";
import { FiHeart } from "react-icons/fi";

import styles from "./AdvertLikeBtn.module.css";

export function AdvertLikeBtn() {
  return (
    <Button className={styles.btn} size="small" type="text">
      <FiHeart size={24} />
    </Button>
  )
}