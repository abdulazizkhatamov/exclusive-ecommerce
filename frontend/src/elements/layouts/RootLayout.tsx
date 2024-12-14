import React from "react";
import { Outlet } from "react-router-dom";
import HeaderNavigation from "@/components/custom/headerNavigation/HeaderNavigation.tsx";
import Footer from "@/components/custom/Footer.tsx";
import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {}

const RootLayout: React.FC<RootLayoutProps> = ({}) => {
  return (
    <div>
      <HeaderNavigation />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
};

export default RootLayout;
