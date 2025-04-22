import { Outlet } from "react-router";
import { Layout } from "antd";

import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";
import { Container } from "@/components/common/Container.jsx";
import { Header } from "@/components/layout/header/Header.jsx";

const { Content } = Layout;

export function DefaultLayout() {

  return (
    <Layout>
      <Header/>
      <Content style={{ minHeight: "calc(100vh - 64px)" }}>
        <Container style={{ paddingBlock: 20 }}>
          <ErrorBoundary>
            <Outlet/>
          </ErrorBoundary>
        </Container>
      </Content>
    </Layout>
  )
}