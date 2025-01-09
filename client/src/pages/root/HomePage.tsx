import React from "react";
import HomeHeader from "@/features/home/home-header/HomeHeader.tsx";
import FlashSales from "@/features/home/FlashSales.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import Categories from "@/features/home/Categories.tsx";
import BestSelling from "@/features/home/BestSelling.tsx";
import Showcase from "@/features/home/Showcase.tsx";
import Features from "@/components/custom/Features.tsx";
import ExploreProducts from "@/features/home/ExploreProducts.tsx";
import Featured from "@/features/home/Featured.tsx";

const HomePage: React.FC = () => {
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
