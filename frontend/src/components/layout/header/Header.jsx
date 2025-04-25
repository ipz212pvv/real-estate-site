import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Button, Flex, Layout, Menu, Grid, Drawer } from "antd";

import { Container } from "@/components/common/Container.jsx";
import { FaRegUserCircle } from "react-icons/fa";
import { FiHeart, FiMenu } from "react-icons/fi";

import { matchPathname } from "@/utils/matchPathname.js";
import styles from "./Header.module.css";
import { ADVERT_TYPES } from "@/config/constants.js";
import { useMenu } from "@/hooks/useMenu.jsx";

const NAV_ITEMS = [
  {
    label: "Головна",
    path: "/",
    url: "/"
  },
  {
    label: "Купівля",
    path: `/buy?typeId=${ADVERT_TYPES.SELL}`,
    url: "/buy"
  },
  {
    label: "Оренда",
    path: `/rent?typeId=${ADVERT_TYPES.RENT}`,
    url: "/rent"
  },
  {
    label: "Новобудови",
    path: `/new-buildings?typeId=${ADVERT_TYPES.NEW_BUILDING}`,
    url: "/new-buildings"
  },
];

export function Header() {
  const screens = Grid.useBreakpoint();
  const { menuItems, setActiveLink, active } = useMenu(NAV_ITEMS);
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector(state => state.auth.user);

  const activeSavedLink = useMemo(() => matchPathname("/saved", { strict: true }), [location]);

  const handleChangeMenuItem = (e) => {
    if (openDrawer) setOpenDrawer(false);
    setActiveLink(e.key)
  };

  return (
    <Layout.Header className={styles.header}>
      <Container>
        <Flex gap="middle" justify="space-between" align="center">
          {screens.md ? (
            <Menu
              className={styles["menu-desktop"]}
              selectedKeys={active}
              mode="horizontal"
              onClick={handleChangeMenuItem}
              items={menuItems}
            />
          ) : (
            <>
              <Button style={{ padding: 0 }} type="text" onClick={() => setOpenDrawer(true)}>
                <FiMenu size="28px" />
              </Button>
              <Drawer
                classNames={{
                  header: styles["drawer-header"],
                }}
                styles={{
                  body: {
                    padding: "16px",
                  }
                }}
                title="Меню"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
              >
                <Menu
                  selectedKeys={active}
                  onClick={handleChangeMenuItem}
                  items={menuItems}
                  style={{ flex: 1, minWidth: 0, border: "none" }}
                />
              </Drawer>
            </>
          )}
          <Flex gap="small">
            <Link to="/saved">
              <Button
                size="large"
                type="text"
                icon={
                  <FiHeart
                    size={24}
                    color={activeSavedLink ? "var(--ant-orange-6)" : "initial" }
                    fill={activeSavedLink ? "var(--ant-orange-6)" : "transparent"}
                  />
                }
              />
            </Link>
            <Link to={user ? (user.role === "admin" ? "/admin/adverts" : "/profile") : "/login"}>
              <Button size="large" type="text" style={{ fontSize: "16px" }}>
                <FaRegUserCircle size="20px"/> {user ? (user.role === "admin" ? "Адмін панель" : "Профіль")  : "Увійти"}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Layout.Header>
  )
}
