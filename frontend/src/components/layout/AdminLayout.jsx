import { Layout, Menu } from "antd";
import { Outlet } from "react-router";

import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";

import { useMenu } from "@/hooks/useMenu.jsx";
import { logout } from "@/store/slices/authSlice.js";
import { store } from "@/store/store.js";

const { Content, Sider } = Layout;

const NAV_ITEMS = [
  {
    label: "Оголошення",
    path: "/admin/adverts",
  },
  {
    label: "Користувачі",
    path: "/admin/users",
  },
  {
    label: "Види нерухомості",
    path: "/admin/property-types",
  },
  {
    label: "Переваги",
    path: "/admin/benefits",
  },
  {
    label: "Скарги",
    path: "/admin/complaints",
  },
  {
    label: (
      <div onClick={() => store.dispatch(logout({ redirectTo: "/" }))}>
        Вихід
      </div>
    ),
    danger: true,
  }
];

const siderStyle = {
  height: '100vh',
  position: 'sticky',
  top: 0,
  bottom: 0,
};

export function AdminLayout() {
  const { menuItems, active } = useMenu(NAV_ITEMS);

  return (
    <Layout hasSider>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={siderStyle}
      >
        <Menu theme="dark" mode="inline" selectedKeys={active} items={menuItems} />
      </Sider>
      <Content style={{ padding: 16, overflow: 'initial' }}>
        <ErrorBoundary>
          <Outlet/>
        </ErrorBoundary>
      </Content>
    </Layout>
  );
}