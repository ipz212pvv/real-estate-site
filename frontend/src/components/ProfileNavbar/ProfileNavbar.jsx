import { useMemo } from "react";
import { NavLink } from "react-router";
import { Card, Flex, Menu, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { Image } from "@/components/common/Image.jsx";

import { logout } from "@/store/slices/authSlice.js";

const NAV_ITEMS = [
  {
    label: "Персональні дані",
    path: "/profile",
  },
  {
    label: "Мої оголошення",
    path: "/profile/adverts",
  },
];

const AVATAR_FALLBACK = "data:image/svg+xml;base64,PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0iI2FiYWJhYiIgc3Ryb2tlLXdpZHRoPSIwIiB2aWV3Qm94PSIwIDAgNDk2IDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQ4IDhDMTExIDggMCAxMTkgMCAyNTZzMTExIDI0OCAyNDggMjQ4IDI0OC0xMTEgMjQ4LTI0OFMzODUgOCAyNDggOHptMCA5NmM0OC42IDAgODggMzkuNCA4OCA4OHMtMzkuNCA4OC04OCA4OC04OC0zOS40LTg4LTg4IDM5LjQtODggODgtODh6bTAgMzQ0Yy01OC43IDAtMTExLjMtMjYuNi0xNDYuNS02OC4yIDE4LjgtMzUuNCA1NS42LTU5LjggOTguNS01OS44IDIuNCAwIDQuOC40IDcuMSAxLjEgMTMgNC4yIDI2LjYgNi45IDQwLjkgNi45IDE0LjMgMCAyOC0yLjcgNDAuOS02LjkgMi4zLS43IDQuNy0xLjEgNy4xLTEuMSA0Mi45IDAgNzkuNyAyNC40IDk4LjUgNTkuOEMzNTkuMyA0MjEuNCAzMDYuNyA0NDggMjQ4IDQ0OHoiPjwvcGF0aD48L3N2Zz4K"

export function ProfileNavbar() {
  const { name, surname, image, email } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout({ redirectTo: "/" }));

  const menuItems = useMemo(() => {
    let items = NAV_ITEMS.map(({ label, path }, i) => ({
      key: i.toString(),
      label: (
        <NavLink to={path}>
          {label}
        </NavLink>
      ),
    }));

    items.push({
      key: "logout",
      label: (
        <div onClick={handleLogout}>
          Вихід
        </div>
      ),
      danger: true
    })

    return items;
  }, []);

  return (
    <Flex gap="middle" vertical>
      <Card styles={{ body: { padding: "12px" } }}>
        <Flex gap="middle" align="center">
          <Image
            style={{ flex: "0 0 auto", minWidth: 40, borderRadius: "50px" }}
            width={40}
            height={40}
            src={image}
            fallback={AVATAR_FALLBACK}
          />
          <Flex style={{ overflow: "hidden" }} vertical>
            <Typography.Text ellipsis>{name} {surname}</Typography.Text>
            <Typography.Text style={{ fontSize: "12px" }}>{email}</Typography.Text>
          </Flex>
        </Flex>
      </Card>
      <Card styles={{ body: { padding: 0 } }}>
        <Menu style={{ border: "none", background: "none" }} mode="vertical" selectable={false} items={menuItems} />
      </Card>
    </Flex>
  )
}