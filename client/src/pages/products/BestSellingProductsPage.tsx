import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getBestSellingProducts } from "@/api/requests.ts";
import Products from "@/features/products/Products.tsx";

const BestSellingProductsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["category-products"],
    queryFn: getBestSellingProducts,
  });

  if (data && !data.data.length) {
    navigate("/");
  }

  return (
    <main className="font-inter container mx-auto px-4 pt-10 mb-32">
      {data && (
        <Products data={data.data} title={data.data[0]?.category.name || ""} />
      )}
    </main>
  );
};

export default BestSellingProductsPage;
