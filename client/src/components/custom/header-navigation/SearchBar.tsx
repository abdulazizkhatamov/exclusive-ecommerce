import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useTranslation } from "react-i18next";

const SearchBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <form className="hidden lg:block">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={t("search_bar")}
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        />
      </div>
    </form>
  );
};

export default SearchBar;
