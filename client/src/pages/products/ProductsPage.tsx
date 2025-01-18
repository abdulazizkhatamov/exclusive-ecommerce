import React from "react";
import { useQuery } from "react-query";
import { getProducts } from "@/api/requests.ts";

import Products from "@/features/products/Products.tsx";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

const ProductsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-products"],
    queryFn: getProducts,
  });

  if (isLoading)
    return (
      <div className={"w-screen h-screen items-center flex justify-center"}>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  if (error) return <Navigate to={"/"} replace={true} />;

  return (
    <main className="font-inter container mx-auto px-4 pt-10 mb-32">
      {data && <Products data={data.data} title={"All products"} />}
    </main>
  );
};

export default ProductsPage;
