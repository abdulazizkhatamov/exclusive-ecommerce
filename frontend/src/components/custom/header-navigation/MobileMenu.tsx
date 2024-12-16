import React from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import CategoryItem from "./CategoryItem";
import { useTranslation } from "react-i18next";

const categories = [
  {
    name: "Woman's Fashion",
    href: "#",
    subcategories: [
      { name: "Woman's Fashion", href: "#" },
      { name: "Dresses", href: "#dresses" },
      { name: "Tops", href: "#tops" },
      { name: "Shoes", href: "#shoes" },
      { name: "Accessories", href: "#accessories" },
    ],
  },
  {
    name: "Men's Fashion",
    href: "#",
    subcategories: [
      { name: "Men's Fashion", href: "#fashion" },
      { name: "Shirts", href: "#shirts" },
      { name: "Pants", href: "#pants" },
      { name: "Shoes", href: "#shoes" },
      { name: "Accessories", href: "#accessories" },
    ],
  },
  { name: "Electronics", href: "#" },
  { name: "Home & Lifestyle", href: "#" },
  { name: "Medicine", href: "#" },
  { name: "Sports & Outdoor", href: "#" },
  { name: "Baby's & Toys", href: "#" },
  { name: "Groceries & Pets", href: "#" },
  { name: "Health & Beauty", href: "#" },
];

const MobileMenu: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base lg:hidden">
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="text-md font-medium hover:text-gray-900/90">
            {t("home")}
          </Link>
          <Link
            to="/contact"
            className="text-md font-medium hover:text-gray-900/90"
          >
            {t("contact")}
          </Link>
          <Link
            to="/about"
            className="text-md font-medium hover:text-gray-900/90"
          >
            {t("about")}
          </Link>
          <Separator className="my-4" />
          {categories.map((category) => (
            <CategoryItem key={category.name} category={category} />
          ))}
          <Separator className="my-4" />
          <div className={"flex justify-between px-5"}>
            <Link
              to="/login"
              className="text-md font-medium hover:text-gray-900/90"
            >
              {t("sign_in")}
            </Link>
            <Link
              to="/register"
              className="text-md font-medium hover:text-gray-900/90"
            >
              {t("sign_up")}
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
