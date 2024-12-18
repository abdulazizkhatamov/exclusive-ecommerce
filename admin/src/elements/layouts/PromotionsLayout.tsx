import React from "react";
import { Outlet } from "react-router-dom";

interface PromotionsLayoutProps {}

const PromotionsLayout: React.FC<PromotionsLayoutProps> = ({}) => {
  return <Outlet />;
};

export default PromotionsLayout;
