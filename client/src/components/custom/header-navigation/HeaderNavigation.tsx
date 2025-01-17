// HeaderNavigation.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ShoppingCart, LogOut, User, ShoppingBag } from "lucide-react";
import AnnouncementBanner from "@/components/custom/header-navigation/AnnouncementBanner.tsx";
import MobileMenu from "@/components/custom/header-navigation/MobileMenu.tsx";
import NavigationMenu from "@/components/custom/header-navigation/NavigationMenu.tsx";
import SearchBar from "@/components/custom/header-navigation/SearchBar.tsx";
import LanguageSelector from "@/components/custom/header-navigation/LanguageSelector.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { useMutation } from "react-query";
import { postLogoutAccount } from "@/features/auth/reqests.ts";

const HeaderNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const logoutMutation = useMutation({ mutationFn: postLogoutAccount });

  const logoutHandler = () => {
    logoutMutation.mutate();
    navigate("/");
  };

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

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {user?.cart && user?.cart.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-xs px-1.5 rounded-full text-white shadow-lg transform translate-x-1/2 translate-y-1/2 transition-all duration-200">
                  {user.cart.length}
                </div>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className=" border-white/20 hover:bg-white/20"
                >
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/50 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                <Link to={"/account/orders"}>
                  <DropdownMenuItem className="gap-3 p-3 focus:bg-white/20 hover:bg-white/20 rounded-md transition-colors duration-200 cursor-pointer">
                    <User className="h-5 w-5 text-white" />
                    <span className="text-white">Manage My Account</span>
                  </DropdownMenuItem>
                </Link>
                <Link to={"/account/orders"}>
                  <DropdownMenuItem className="gap-3 p-3 focus:bg-white/20 hover:bg-white/20 rounded-md transition-colors duration-200 cursor-pointer">
                    <ShoppingBag className="h-5 w-5 text-white" />
                    <span className="text-white">My Orders</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="gap-3 p-3 focus:bg-white/20 hover:bg-white/20 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 text-white" />
                  <span className="text-white">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"/signin"}>
              <Button
                variant="outline"
                className=" border-white/20 hover:bg-white/20"
              >
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
          )}

          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default HeaderNavigation;
