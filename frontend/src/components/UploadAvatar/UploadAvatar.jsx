import { useEffect } from "react";
import { Button, Flex, notification, Typography, Upload } from "antd";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";

import { Loading } from "@/components/common/Loading/Loading.jsx";
import { Image } from "@/components/common/Image.jsx";

import { validateImageFormat, validateImageSize } from "@/utils/imageValidation.js";
import { MAX_AVATAR_SIZE } from "@/config/constants.js";
import { useDeleteAvatarMutation, useUploadAvatarMutation } from "@/store/services/users.js";
import styles from "./UploadAvatar.module.css";

export function UploadAvatar() {
  const { id: userId, image } = useSelector(state => state.auth.user);
  const [uploadAvatar, { isLoading: isUploading, error: uploadError }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting, error: deleteError }] = useDeleteAvatarMutation();

  const beforeUpload = file => {
    const isValidFormat = validateImageFormat(file);
    const isValidSize = validateImageSize(file, MAX_AVATAR_SIZE);

    return isValidFormat && isValidSize;
  };

  const handleUploadAvatar = ({ file }) => uploadAvatar({ userId, avatar: file })

  const handleDeleteAvatar = () => deleteAvatar(userId)

  useEffect(() => {
    const error = uploadError || deleteError;

    if (error) {
      notification.error({
        message: "Помилка",
        description: error.message,
      });
    }
  }, [uploadError, deleteError]);

  return (
    image ? (
      <Flex gap="small" vertical>
        <Image style={{ borderRadius: 8 }} width={200} height={200} src={image} />
        <Button
          style={{
            width: "fit-content",
            margin: "0 auto"
          }}
          onClick={handleDeleteAvatar}
          disabled={isDeleting}
          type="link"
          danger
        >
          <FaTrash/> Видалити фото
        </Button>
      </Flex>
    ) : (
      <Upload
        className={styles.avatar}
        accept="image/png, image/jpeg"
        listType="picture-card"
        maxCount={1}
        showUploadList={false}
        customRequest={handleUploadAvatar}
        beforeUpload={beforeUpload}
      >
        {isUploading ? (
          <>
            <Loading size={32} />
            <Typography.Text style={{ marginTop: 4 }}>Завантаження...</Typography.Text>
          </>
        ) : (
          <>
            <GoPlus size={32} />
            <Typography.Text style={{ marginTop: 4 }}>Додати фото</Typography.Text>
          </>
        )}
      </Upload>
    )
  )
}