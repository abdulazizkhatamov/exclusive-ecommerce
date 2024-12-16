import React from "react";
import HomeHeader from "@/components/custom/home-header/HomeHeader.tsx";
import FlashSales from "@/components/custom/FlashSales.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import Categories from "@/components/custom/Categories.tsx";
import BestSelling from "@/components/custom/BestSelling.tsx";
import Showcase from "@/components/custom/Showcase.tsx";
import Features from "@/components/custom/Features.tsx";
import ExploreProducts from "@/components/custom/ExploreProducts.tsx";
import Featured from "@/components/custom/Featured.tsx";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  return (
    <main className={"container mx-auto px-4 pt-10 mb-32"}>
      <HomeHeader />
      <FlashSales />
      <Separator />
      <Categories />
      <Separator />
      <BestSelling />
      <Showcase />
      <ExploreProducts />
      <Featured />
      <Features />
    </main>
  );
};

export default HomePage;
