import React from "react";
import { HomeHeaderNav } from "@/features/home/home-header/HomeHeaderNav.tsx";
import { HomeHeaderPromo } from "@/features/home/home-header/HomeHeaderPromo.tsx";

const HomeHeader: React.FC = () => {
  return (
    <header className="mx-auto relative grid grid-cols-[auto,1fr] lg:gap-6 py-6 z-10">
      <HomeHeaderNav />
      <HomeHeaderPromo />
    </header>
  );
};

export default HomeHeader;
