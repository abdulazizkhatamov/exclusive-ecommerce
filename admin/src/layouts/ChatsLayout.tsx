import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.tsx";

const ChatsLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default ChatsLayout;
