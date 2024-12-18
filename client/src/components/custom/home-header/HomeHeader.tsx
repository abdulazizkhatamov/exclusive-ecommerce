import React from "react";
import { HomeHeaderNav } from "@/components/custom/home-header/HomeHeaderNav.tsx";
import { HomeHeaderPromo } from "@/components/custom/home-header/HomeHeaderPromo.tsx";

interface HomeHeaderProps {}

const HomeHeader: React.FC<HomeHeaderProps> = ({}) => {
  return (
    <header className="mx-auto relative grid grid-cols-[auto,1fr] lg:gap-6 py-6 z-10">
      <HomeHeaderNav />
      <HomeHeaderPromo />
    </header>
  );
};

export default HomeHeader;
