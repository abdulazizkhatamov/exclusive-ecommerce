import React from "react";
import { Link } from "react-router-dom";
// import ProductCard from "@/components/custom/ProductCard.tsx";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getLimitedBestSellingProducts } from "@/api/requests.ts";
import ProductCard from "@/components/custom/ProductCard.tsx";
import { IProduct } from "@/types/product.ts";

const BestSelling: React.FC = () => {
  const { t } = useTranslation();
  const { data: productsResponse } = useQuery({
    queryKey: ["best-selling"],
    queryFn: getLimitedBestSellingProducts,
    placeholderData: { success: false, data: [] }, // Provide default structure
  });

  // Ensure products is an array
  const products = Array.isArray(productsResponse?.data)
    ? productsResponse.data
    : [];

  return (
    <div className="my-20 px-4">
      <div className="my-10">
        <h3 className="mb-5 border-l-8 border-l-primary_red pl-4 font-poppins font-semibold text-[1rem] leading-[1.25rem] text-primary_red">
          {t("page_home.sections.best_selling.red_title")}
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-inter font-semibold text-[1.8rem] md:text-[2.25rem] leading-[3rem] tracking-[0.04em] text-black">
              {t("page_home.sections.best_selling.title")}
            </h1>
          </div>
          <div className="max-w-max">
            <div className="text-center">
              <Link to={"/products/best-selling"}>
                <button className="px-4 sm:px-8 py-2 bg-primary_red font-poppins text-[0.875rem] sm:text-[1rem] leading-[1.25rem] sm:leading-[1.5rem] text-[#FAFAFA] rounded hover:bg-red-600 transition-colors whitespace-nowrap">
                  {t("page_home.sections.best_selling.view_all")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product: IProduct) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        ) : (
          <div className="block px-4 text-sm text-black font-medium text-center py-5">
            {t("page_home.sections.best_selling.no_products")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSelling;
