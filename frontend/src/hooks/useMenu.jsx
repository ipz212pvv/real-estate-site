import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";

import { matchPathname } from "@/utils/matchPathname.js";

export function useMenu(items) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const active = activeLink !== null ? [activeLink.toString()] : [];

  const menuItems = useMemo(() => items.map(({ label, path, ...rest }, i) => ({
    key: i.toString(),
    label: (
      path ? (
        <NavLink to={path}>
          {label}
        </NavLink>
      ) : label
    ),
    ...rest,
  })), [items]);

  useEffect(() => {
    setActiveLink(null);

    items.forEach(({ path, url }, i) => {
      if(matchPathname(url || path, { strict: true })) {
        setActiveLink(i);
      }
    })
  }, [location]);

  return {
    menuItems,
    setActiveLink,
    active
  }
}