// HeaderNavigation.tsx
import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { ShoppingCart, User } from "lucide-react";
import AnnouncementBanner from "@/components/custom/headerNavigation/AnnouncementBanner.tsx";
import MobileMenu from "@/components/custom/headerNavigation/MobileMenu.tsx";
import NavigationMenu from "@/components/custom/headerNavigation/NavigationMenu.tsx";
import SearchBar from "@/components/custom/headerNavigation/SearchBar.tsx";
import LanguageSelector from "@/components/custom/headerNavigation/LanguageSelector.tsx";

const HeaderNavigation: React.FC = () => {
  return (
    <header className="w-full font-inter border-b border-b-[#B3B3B3]">
      <AnnouncementBanner />

      <div className="container mx-auto flex h-16 items-center px-4">
        <MobileMenu />

        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold">Exclusive</span>
        </Link>

        <NavigationMenu />

        <div className="ml-auto flex items-center space-x-4">
          <SearchBar />

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700"
            aria-label="AccountPage"
          >
            <User className="h-5 w-5" />
          </Button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default HeaderNavigation;
