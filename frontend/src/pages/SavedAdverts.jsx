import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";

import { AdvertList } from "@/components/AdvertList/AdvertList.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";

import { selectSavedAdvertIds } from "@/store/slices/savedAdvertsSlice.js";
import { useGetAdvertsByIdsQuery } from "@/store/services/adverts.js";

export function SavedAdverts() {
  const savedAdvertIds = useSelector(selectSavedAdvertIds);
  const { data: adverts = [], isLoading, isFetching } = useGetAdvertsByIdsQuery(savedAdvertIds);

  if (isLoading || isFetching) return <Loading/>;

  return (
    <>
      <Flex justify="space-between">
        <Typography.Title level={2}>Збережені оголошення</Typography.Title>
      </Flex>
      <AdvertList adverts={adverts} />
    </>
  );
}
