import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.tsx";

const CategoriesLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default CategoriesLayout;
