import { Button } from "antd";
import { FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { addSavedAdvert, removeSavedAdvert, selectSavedAdvertIds } from "@/store/slices/savedAdvertsSlice.js";
import styles from "./AdvertLikeBtn.module.css";

export function AdvertLikeBtn({ advertId }) {
  const dispatch = useDispatch();
  const savedAdvertIds = useSelector(selectSavedAdvertIds);
  const isSaved = savedAdvertIds.includes(advertId);

  const handleToggleSave = (e) => {
    e.preventDefault();

    if (isSaved) {
      dispatch(removeSavedAdvert(advertId));
    } else {
      dispatch(addSavedAdvert(advertId));
    }
  };

  return (
    <Button 
      className={styles.btn} 
      size="small" 
      type="text"
      onClick={handleToggleSave}
    >
      <FiHeart 
        size={24} 
        fill={isSaved ? "var(--ant-orange-6)" : "none"} 
        color={isSaved ? "var(--ant-orange-6)" : "currentColor"} 
      />
    </Button>
  )
}
