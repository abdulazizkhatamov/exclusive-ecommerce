import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getBestSellingProducts } from "@/api/requests.ts";
import Products from "@/features/products/Products.tsx";
import { Loader } from "lucide-react";

const BestSellingProductsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["category-products"],
    queryFn: getBestSellingProducts,
  });

  if (isLoading)
    return (
      <div className={"w-screen h-screen items-center flex justify-center"}>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  if (error || !data.data.length) return <Navigate to={"/"} replace={true} />;

  return (
    <main className="font-inter container mx-auto px-4 pt-10 mb-32">
      {data && (
        <Products data={data.data} title={data.data[0]?.category.name || ""} />
      )}
    </main>
  );
};

export default BestSellingProductsPage;
