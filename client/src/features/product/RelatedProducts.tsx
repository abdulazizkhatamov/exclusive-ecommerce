import React from "react";

import { IProduct } from "@/types/product.ts";
import ProductCard from "@/components/custom/ProductCard.tsx";
import { useTranslation } from "react-i18next";

interface RelatedProductsProps {
  products: IProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const { t } = useTranslation();

  return (
    <div className="my-20 px-4">
      <div className="my-10">
        <h3 className="mb-5 border-l-8 border-l-primary_red pl-4 font-poppins font-semibold text-[1rem] leading-[1.25rem] text-primary_red">
          {t("page_product.sections.related_products.red_title")}
        </h3>
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
            {t("page_product.sections.related_products.no_products")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
