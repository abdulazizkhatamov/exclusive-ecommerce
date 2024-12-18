import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";

interface CategoriesProps {}

const categories = [
  {
    name: "Woman's Fashion",
    href: "#",
    image: "/images/womens-fashion.jpg", // Replace with actual image path
    subcategories: [
      { name: "Dresses", href: "#dresses" },
      { name: "Tops", href: "#tops" },
      { name: "Shoes", href: "#shoes" },
      { name: "Accessories", href: "#accessories" },
    ],
  },
  {
    name: "Men's Fashion",
    href: "#",
    image: "/images/mens-fashion.jpg", // Replace with actual image path
    subcategories: [
      { name: "Shirts", href: "#shirts" },
      { name: "Pants", href: "#pants" },
      { name: "Shoes", href: "#shoes" },
      { name: "Accessories", href: "#accessories" },
    ],
  },
  { name: "Electronics", href: "#", image: "/images/electronics.jpg" },
  { name: "Home & Lifestyle", href: "#", image: "/images/home-lifestyle.jpg" },
  { name: "Medicine", href: "#", image: "/images/medicine.jpg" },
  { name: "Sports & Outdoor", href: "#", image: "/images/sports-outdoor.jpg" },
  { name: "Baby's & Toys", href: "#", image: "/images/babys-toys.jpg" },
  { name: "Groceries & Pets", href: "#", image: "/images/groceries-pets.jpg" },
  { name: "Health & Beauty", href: "#", image: "/images/health-beauty.jpg" },
];

const Categories: React.FC<CategoriesProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <div className="my-20 px-4">
      <Carousel opts={{ align: "start" }}>
        <div className="my-10">
          <h3 className="mb-5 border-l-8 border-l-primary_red pl-4 font-poppins font-semibold text-[1rem] leading-[1.25rem] text-primary_red">
            {t("page_home.sections.categories.red_title")}
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-inter font-semibold text-[1.8rem] md:text-[2.25rem] leading-[3rem] tracking-[0.04em] text-black">
                {t("page_home.sections.categories.title")}
              </h1>
            </div>
            <div className="relative max-w-max right-11 flex items-center z-10">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </div>
        {categories.length > 0 ? (
          <CarouselContent className="py-5">
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/4 lg:basis-1/6"
              >
                <Link to={"/categories"} className="block">
                  <Card className="group hover:bg-primary_red hover:text-white transition-all duration-300 ease-in-out">
                    <CardContent className="flex justify-center text-center aspect-square items-center p-6">
                      <div>
                        {/*<img*/}
                        {/*  src={categories.image}*/}
                        {/*  alt={categories.name}*/}
                        {/*  className="w-16 h-16 mx-auto object-contain"*/}
                        {/*/>*/}
                        <p className="font-poppins font-normal text-[1rem] leading-[1.5rem] mt-3">
                          {category.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <div className="block px-4 text-sm text-black font-medium text-center py-5">
            {t("page_home.sections.categories.no_categories")}
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default Categories;
