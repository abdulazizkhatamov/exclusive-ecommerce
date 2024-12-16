import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu as Menu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";
import { useTranslation } from "react-i18next";

const NavigationMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Menu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            to="/"
            className="group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium"
          >
            {t("home")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/contact"
            className="group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium"
          >
            {t("contact")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/about"
            className="group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium"
          >
            {t("about")}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </Menu>
  );
};

export default NavigationMenu;
