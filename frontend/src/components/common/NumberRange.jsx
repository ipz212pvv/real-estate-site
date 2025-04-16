import { Flex, InputNumber, Typography } from "antd";
import { useSearchParams } from "@/hooks/useSearchParams.js";

export function NumberRange() {
  const { updateSearchParams } = useSearchParams();

  return (
    <Flex>
      <InputNumber
        style={{ width: "100%" }}
        min={1}
        placeholder="Від"
        onChange={value => updateSearchParams("minPriceUsd", value)}
      />
      <Typography.Text style={{ padding: "0 16px" }}>-</Typography.Text>
      <InputNumber
        style={{ width: "100%" }}
        min={1}
        placeholder="До"
        onChange={value => updateSearchParams("maxPriceUsd", value)}
      />
    </Flex>
  )
}