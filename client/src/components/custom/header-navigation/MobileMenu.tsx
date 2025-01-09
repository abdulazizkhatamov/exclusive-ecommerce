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
import { useQuery } from "react-query";
import { getCategories } from "@/api/requests.ts";

interface Category {
  _id: string;
  name: string;
  description?: string;
  status: boolean;
  parent?: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface TransformedCategory {
  name: string;
  href: string;
  subcategories: {
    name: string;
    href: string;
  }[];
}

const MobileMenu: React.FC = () => {
  const { t } = useTranslation();

  const { data } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Transforming the categories data into the desired structure
  const categories: TransformedCategory[] =
    data?.data?.reduce<TransformedCategory[]>((acc, category) => {
      if (!category.parent) {
        acc.push({
          name: category.name,
          href: `/category/${category._id}`,
          subcategories: [],
        });
      } else {
        const parentCategory = acc.find(
          (cat) => cat.name === category.parent?.name,
        );
        if (parentCategory) {
          parentCategory.subcategories.push({
            name: category.name,
            href: `/category/${category._id}`,
          });
        }
      }
      return acc;
    }, []) || [];

  // Sorting categories: first categories with subcategories, then alphabetically
  const sortedCategories = categories.sort((a, b) => {
    if (a.subcategories.length > 0 && b.subcategories.length === 0) return -1;
    if (a.subcategories.length === 0 && b.subcategories.length > 0) return 1;
    return a.name.localeCompare(b.name);
  });

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
          {sortedCategories.map((category) => (
            <CategoryItem key={category.name} category={category} />
          ))}
          <Separator className="my-4" />
          <div className={"flex justify-between px-5"}>
            <Link
              to="/signin"
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
