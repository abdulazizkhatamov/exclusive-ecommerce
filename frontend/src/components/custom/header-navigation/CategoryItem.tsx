import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { ChevronDown, ChevronsUp } from "lucide-react";

interface Category {
  name: string;
  href: string;
  subcategories?: Category[];
}

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (category.subcategories) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between text-md font-medium hover:text-gray-900/90">
            {category.name}
            {isOpen ? (
              <ChevronsUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2 pl-4">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.name}
              to={subcategory.href}
              className="block text-sm hover:text-gray-900/90"
            >
              {subcategory.name}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      to={category.href}
      className="text-md font-medium hover:text-gray-900/90"
    >
      {category.name}
    </Link>
  );
};

export default CategoryItem;
