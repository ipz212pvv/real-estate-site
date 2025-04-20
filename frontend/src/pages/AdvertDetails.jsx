import { useParams } from "react-router";
import { Badge, Col, Row } from "antd";

import { ImageCarousel } from "@/components/ImageCarousel/ImageCarousel.jsx";
import { AdvertInfoList } from "@/components/AdvertInfo/AdvertInfoList.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";
import { AdvertSellerCard } from "@/components/AdvertSellerCard/AdvertSellerCard.jsx";

import { useGetAdvertByIdQuery } from "@/store/services/adverts.js";

export function AdvertDetails() {
  const { id } = useParams();
  const { data: advert, isLoading, error } = useGetAdvertByIdQuery(id);

  if (isLoading) return <Loading/>
  if (error) return <NotFound />

  const {
    advertImages,
    createdAt,
    userOfAdvert,
    advertPropertyTypeForAdvert: {
      name: propertyTypeName,
    },
  } = advert;

  const imageList = advertImages?.map(({ imageUrl }) => imageUrl);
  const previewOptions = {
    toolbarRender: (_, { icons: { zoomInIcon, zoomOutIcon } }) => (
      <div className="ant-image-preview-operations">
        {zoomOutIcon}
        {zoomInIcon}
      </div>
    )
  };
  const imagePreview = imageList.length > 0 ? previewOptions : false;

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Badge.Ribbon placement="start" text={propertyTypeName}>
          <div style={{ width: "100%", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <ImageCarousel
              imageProps={{ preview: imagePreview }}
              imageStyle={{
                maxHeight: 550,
                height: "100%",
                objectFit: "contain"
              }}
              images={imageList}
            />
          </div>
        </Badge.Ribbon>
        <AdvertInfoList advert={advert} />
      </Col>

      <Col xs={24} lg={8}>
        <AdvertSellerCard seller={userOfAdvert} createdAt={createdAt} />
      </Col>
    </Row>
  );
}