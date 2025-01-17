import React from "react";
import { useQuery } from "react-query";
import { getCategoryProducts } from "@/api/requests.ts";
import Products from "@/features/products/Products.tsx";
import { useNavigate, useParams } from "react-router-dom";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["category-products"],
    queryFn: () => getCategoryProducts(id as string),
  });

  if (!id) {
    navigate("/");
  }

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

export default CategoryProductsPage;
