import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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

export function HomeHeaderNav() {
  const { data } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

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

  const sortedCategories = categories.sort((a, b) => {
    if (a.subcategories.length > 0 && b.subcategories.length === 0) return -1;
    if (a.subcategories.length === 0 && b.subcategories.length > 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <nav className="hidden lg:block w-64 bg-white shadow-lg z-20">
      <ul className="space-y-1">
        {sortedCategories.map((category) => (
          <li key={category.name} className="group relative">
            <Link
              to={category.href}
              className="flex items-center justify-between px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
            >
              {category.name}
              {category.subcategories.length > 0 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
            {category.subcategories.length > 0 && (
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
