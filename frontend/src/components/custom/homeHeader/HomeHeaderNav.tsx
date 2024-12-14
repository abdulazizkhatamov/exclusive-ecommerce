import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Woman's Fashion",
    href: "#",
    subcategories: [
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

export function HomeHeaderNav() {
  return (
    <nav className="hidden lg:block w-64 bg-white shadow-lg z-20">
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.name} className="group relative">
            <Link
              to={category.href}
              className="flex items-center justify-between px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
            >
              {category.name}
              {category.subcategories && <ChevronRight className="h-4 w-4" />}
            </Link>
            {category.subcategories && (
              <ul className="absolute left-full top-0 hidden w-48 bg-white shadow-lg group-hover:block z-10">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.name}>
                    <Link
                      to={subcategory.href}
                      className="block px-4 py-2 text-sm text-black font-medium hover:bg-gray-100"
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
