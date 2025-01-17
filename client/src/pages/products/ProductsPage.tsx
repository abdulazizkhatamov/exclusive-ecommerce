import React from "react";
import { useQuery } from "react-query";
import { getProducts } from "@/api/requests.ts";

import Products from "@/features/products/Products.tsx";

const ProductsPage: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["all-products"],
    queryFn: getProducts,
  });

  return (
    <main className="font-inter container mx-auto px-4 pt-10 mb-32">
      {data && <Products data={data.data} title={"All products"} />}
    </main>
  );
};

export default ProductsPage;
