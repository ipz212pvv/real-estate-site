import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Button, Flex, Layout, Menu, Grid, Drawer } from "antd";

import { Container } from "@/components/common/Container.jsx";
import { FaRegUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

import { matchPathname } from "@/utils/matchPathname.js";
import styles from "./Header.module.css";
import { ADVERT_TYPES } from "@/config/constants.js";

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
  }
];

export function Header() {
  const screens = Grid.useBreakpoint();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    NAV_ITEMS.forEach(({ url }, i) => {
      if(matchPathname(url, { strict: true })) {
        setActiveLink(i);
      }
    })
  }, [location]);

  const selectedKeys = activeLink !== null ? [activeLink.toString()] : [];

  const menuItems = useMemo(() => NAV_ITEMS.map(({ label, path }, i) => ({
    key: i.toString(),
    label: (
      <NavLink to={path}>
        {label}
      </NavLink>
    ),
  })), []);

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
              selectedKeys={selectedKeys}
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
                  selectedKeys={selectedKeys}
                  onClick={handleChangeMenuItem}
                  items={menuItems}
                  style={{ flex: 1, minWidth: 0, border: "none" }}
                />
              </Drawer>
            </>
          )}
          <Flex gap="small">
            <Button
              size="large"
              type="text"
              style={{ fontSize: "16px" }}
              href={user ? "/profile" : "/login"}
            >
              <FaRegUserCircle size="20px"/> {user ? "Профіль" : "Увійти"}
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Layout.Header>
  )
}