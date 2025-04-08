import { Col, Flex, Row, Typography } from "antd";
import { Outlet } from "react-router";

import { ProfileNavbar } from "@/components/ProfileNavbar/ProfileNavbar.jsx";

export function ProfileLayout() {
  return (
    <div>
      <Flex gap="middle" vertical>
        <Typography.Title style={{ fontWeight: "bold", margin: 0 }} level={3}>Особистий кабінет</Typography.Title>
        <Row gutter={[16, 16]}>
          <Col xs={{ flex: "auto" }} md={{ flex: "300px" }}>
            <ProfileNavbar />
          </Col>
          <Col xs={{ flex: "1 1 100%" }} md={{ flex: "1" }}>
            <Outlet/>
          </Col>
        </Row>
      </Flex>
    </div>
  )
}