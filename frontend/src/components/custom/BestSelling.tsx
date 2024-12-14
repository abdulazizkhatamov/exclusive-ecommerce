import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/custom/product/ProductCard.tsx";
import { useTranslation } from "react-i18next";

interface BestSellingProps {}

const products = [
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "http://localhost:5173/public/images/products/product_1.png",
    oldPrice: 160,
    newPrice: 120,
    rating: 4.5,
    reviews: 88,
    discount: 40,
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "http://localhost:5173/public/images/products/product_2.png",
    oldPrice: 160,
    newPrice: 120,
    rating: 4.5,
    reviews: 88,
    discount: 40,
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "http://localhost:5173/public/images/products/product_1.png",
    oldPrice: 160,
    newPrice: 120,
    rating: 4.5,
    reviews: 88,
    discount: 40,
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "http://localhost:5173/public/images/products/product_2.png",
    oldPrice: 160,
    newPrice: 120,
    rating: 4.5,
    reviews: 88,
    discount: 40,
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    image: "http://localhost:5173/public/images/products/product_2.png",
    oldPrice: 160,
    newPrice: 120,
    rating: 4.5,
    reviews: 88,
    discount: 40,
  },
  // ... (other products)
];

const BestSelling: React.FC<BestSellingProps> = ({}) => {
  const { t } = useTranslation();
  // Limit to the first 4 products
  const limitedProducts = products.slice(0, 5);

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
              <Link to={"/all-products"}>
                <button className="px-4 sm:px-8 py-2 bg-primary_red font-poppins text-[0.875rem] sm:text-[1rem] leading-[1.25rem] sm:leading-[1.5rem] text-[#FAFAFA] rounded hover:bg-red-600 transition-colors whitespace-nowrap">
                  {t("page_home.sections.best_selling.view_all")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        {limitedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {limitedProducts.map((product, index) => (
              <div key={index}>
                <ProductCard
                  image={product.image}
                  name={product.name}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  discount={product.discount}
                />
              </div>
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
