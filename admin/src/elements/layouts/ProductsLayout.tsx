import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.tsx";

const ProductsLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default ProductsLayout;
