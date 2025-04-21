import { useMemo } from "react";
import { NavLink } from "react-router";
import { Card, Flex, Menu, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { Avatar } from "@/components/common/Avatar.jsx";

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
          <Avatar src={image} size={40} />
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