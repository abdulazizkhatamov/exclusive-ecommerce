import React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <Select
      defaultValue={localStorage.getItem("locale_lang") || "en"}
      onValueChange={(value) => {
        localStorage.setItem("locale_lang", value);
        i18n.changeLanguage(value);
      }}
    >
      <SelectTrigger className="w-[100px] h-5 border-none text-xs px-1 py-0 flex items-center outline-none shadow-none">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">
            <span className="fi fi-us"></span> English
          </SelectItem>
          <SelectItem value="uz">
            <span className="fi fi-uz"></span> O'zbek
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
