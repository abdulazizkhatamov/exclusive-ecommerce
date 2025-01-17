import React from "react";
import { IProduct } from "@/types/product.ts";
import ProductCard from "@/components/custom/ProductCard.tsx";

interface ProductListProps {
  products: IProduct[];
  currentPage: number;
  itemsPerPage: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  currentPage,
  itemsPerPage,
}) => {
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {paginatedProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
