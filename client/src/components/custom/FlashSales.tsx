import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/custom/product/ProductCard.tsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FlashSalesProps {}

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
  // ... (other products)
];

const FlashSales: React.FC<FlashSalesProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <div className={"my-20"}>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <div className={"my-10"}>
          <h3
            className={
              "mb-5 border-l-8 border-l-primary_red pl-4 font-poppins font-semibold text-[1rem] leading-[1.25rem] text-primary_red"
            }
          >
            {t("page_home.sections.flash_sales.red_title")}
          </h3>
          <div className={"flex justify-between items-center"}>
            <div>
              <h1
                className={
                  "font-inter font-semibold text-[2.25rem] leading-[3rem] tracking-[0.04em] text-black"
                }
              >
                {t("page_home.sections.flash_sales.title")}
              </h1>
            </div>
            <div className="relative max-w-max right-11 flex items-center z-10">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </div>
        {products.length > 0 ? (
          <CarouselContent className={"py-5"}>
            {products.map((product, index) => (
              <CarouselItem key={index} className="basis-auto">
                <ProductCard
                  image={product.image}
                  name={product.name}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  discount={product.discount}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <div className="block px-4 text-sm text-black font-medium  text-center py-5">
            {t("page_home.sections.flash_sales.no_products")}
          </div>
        )}
      </Carousel>

      {/* View All Products Button */}
      <div className="text-center mt-5">
        <Link to={"/all-products"}>
          <button className="px-8 py-2 bg-primary_red font-poppins text-[1rem] leading-[1.5rem] text-[#FAFAFA] rounded hover:bg-red-600 transition-colors">
            {t("page_home.sections.flash_sales.view_all")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FlashSales;
