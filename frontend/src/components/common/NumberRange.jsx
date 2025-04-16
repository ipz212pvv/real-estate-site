import { Flex, InputNumber, Typography } from "antd";

export function NumberRange({
  defaultMinValue,
  defaultMaxValue,
  setMinValue,
  setMaxValue,
  fromInputProps = {},
  toInputProps = {}
}) {
  return (
    <Flex>
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        placeholder="Від"
        defaultValue={defaultMinValue}
        onChange={setMinValue}
        {...fromInputProps}
      />
      <Typography.Text style={{ padding: "0 16px" }}>-</Typography.Text>
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        placeholder="До"
        defaultValue={defaultMaxValue}
        onChange={setMaxValue}
        {...toInputProps}
      />
    </Flex>
  )
}