import { useMemo, useState } from "react";
import { IoOptions } from "react-icons/io5";
import { Button, Drawer, Flex, Input, InputNumber, Select, Space, Typography } from "antd";

import { NumberRange } from "@/components/common/NumberRange.jsx";

import { useSearchParams } from "@/hooks/useSearchParams.js";
import useDebounce from "@/hooks/useDebounce.js";
import { useGetAdvertPropertyTypesQuery } from "@/store/services/advert-property-types.js";
import { useGetBenefitsQuery } from "@/store/services/benefits.js";

export function AdvertsFilter() {
  const [open, setOpen] = useState(false);
  const { searchParams, updateSearchParams } = useSearchParams();
  const { propertyTypeId, minPriceUsd, maxPriceUsd, room, city, minArea, maxArea, benefits: benefitsParams } = searchParams;
  const benefitsValue = benefitsParams?.split(",").map(Number);

  const setMinPriceUsd = useDebounce(value => updateSearchParams("minPriceUsd", value), 500);
  const setMaxPriceUsd = useDebounce(value => updateSearchParams("maxPriceUsd", value), 500);
  const setCity = useDebounce(value => updateSearchParams("city", value), 500);
  const setRoom = useDebounce(value => updateSearchParams("room", value), 500);
  const setMinArea = useDebounce(value => updateSearchParams("minArea", value), 500);
  const setMaxArea = useDebounce(value => updateSearchParams("maxArea", value), 500);

  const { data: propertyTypes = [], isLoading: propertyTypesLoading } = useGetAdvertPropertyTypesQuery();
  const { data: benefits = [], isLoading: benefitsLoading } = useGetBenefitsQuery();

  const propertyTypeOptions = useMemo(() => propertyTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [propertyTypes]);

  const benefitsOptions = useMemo(() => benefits.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [benefits]);

  if (propertyTypesLoading || benefitsLoading) return null;

  return (
    <Flex justify="end" style={{ marginBottom: 24 }}>
      <Button
        style={{ fontWeight: "bold" }}
        type="primary"
        size="large"
        icon={<IoOptions size={24} />}
        onClick={() => setOpen(true)}
      >
        Фільтри
      </Button>
      <Drawer title="Фільтри" onClose={() => setOpen(false)} open={open}>
        <Space style={{ width: "100%" }} size="middle" direction="vertical">
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Вид нерухомості</Typography.Paragraph>
            <Select
              style={{ width: "100%" }}
              defaultValue={propertyTypeId ? Number(propertyTypeId) : null}
              options={propertyTypeOptions}
              onSelect={value => updateSearchParams("propertyTypeId", value)}
              allowClear
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Місто</Typography.Paragraph>
            <Input
              style={{ width: "100%" }}
              defaultValue={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Ціна</Typography.Paragraph>
            <NumberRange
              defaultMinValue={minPriceUsd}
              defaultMaxValue={maxPriceUsd}
              setMinValue={setMinPriceUsd}
              setMaxValue={setMaxPriceUsd}
              fromInputProps={{ suffix: "$" }}
              toInputProps={{ suffix: "$" }}
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Кількість кімнат</Typography.Paragraph>
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              defaultValue={room}
              onChange={setRoom}
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Площа</Typography.Paragraph>
            <NumberRange
              defaultMinValue={minArea}
              defaultMaxValue={maxArea}
              setMinValue={setMinArea}
              setMaxValue={setMaxArea}
              fromInputProps={{ suffix: "м²" }}
              toInputProps={{ suffix: "м²" }}
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Переваги</Typography.Paragraph>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              defaultValue={benefitsValue}
              options={benefitsOptions}
              onChange={value => updateSearchParams("benefits", value)}
              allowClear
            />
          </div>
        </Space>
      </Drawer>
    </Flex>
  )
}