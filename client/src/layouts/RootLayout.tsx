import React from "react";
import { Outlet } from "react-router-dom";
import HeaderNavigation from "@/components/custom/header-navigation/HeaderNavigation.tsx";
import Footer from "@/components/custom/Footer.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import CartSheet from "@/features/cart/CartSheet.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

const RootLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className={"flex flex-col h-screen"}>
      <HeaderNavigation />
      <main className={"flex-grow"}>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <CartSheet cartItems={user?.cart || []} />
    </div>
  );
};

export default RootLayout;
