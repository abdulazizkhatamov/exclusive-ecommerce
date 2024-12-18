import React from "react";
import { Outlet } from "react-router-dom";

interface ProductsLayoutProps {}

const ProductsLayout: React.FC<ProductsLayoutProps> = ({}) => {
  return <Outlet />;
};

export default ProductsLayout;
