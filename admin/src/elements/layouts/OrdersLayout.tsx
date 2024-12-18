import React from "react";
import { Outlet } from "react-router-dom";

interface OrdersLayoutProps {}

const OrdersLayout: React.FC<OrdersLayoutProps> = ({}) => {
  return <Outlet />;
};

export default OrdersLayout;
