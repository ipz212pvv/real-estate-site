import { Outlet } from "react-router";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";
import { Layout } from "antd";
import { Container } from "@/components/common/Container.jsx";
import { Header } from "@/components/layout/header/Header.jsx";

export function DefaultLayout() {
  const { Content } = Layout;

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