import { useMemo, useState } from "react";
import { IoOptions } from "react-icons/io5";
import { Button, Drawer, Flex, Select, Space, Typography } from "antd";

import { useSearchParams } from "@/hooks/useSearchParams.js";
import { useGetAdvertPropertyTypesQuery } from "@/store/services/advert-property-types.js";
import { NumberRange } from "@/components/common/NumberRange.jsx";

export function AdvertsFilter() {
  const [open, setOpen] = useState(false);
  const { searchParams, updateSearchParams } = useSearchParams();
  const { propertyTypeId } = searchParams;

  const { data: propertyTypes = [], isLoading: propertyTypesLoading } = useGetAdvertPropertyTypesQuery();

  const propertyTypeOptions = useMemo(() => propertyTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  })), [propertyTypes]);

  if (propertyTypesLoading) return null;

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
              defaultValue={Number(propertyTypeId)}
              options={propertyTypeOptions}
              onSelect={value => updateSearchParams("propertyTypeId", value)}
              allowClear
            />
          </div>
          <div>
            <Typography.Paragraph style={{ marginBottom: 4 }} strong>Ціна</Typography.Paragraph>
            <NumberRange/>
          </div>
        </Space>
      </Drawer>
    </Flex>
  )
}