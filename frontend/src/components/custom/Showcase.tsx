import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import imageShowcase from "@/assets/showcase_img.png";
import { useTranslation } from "react-i18next";

interface ShowcaseProps {}

const Showcase: React.FC<ShowcaseProps> = ({}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    days: 5,
    minutes: 59,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black rounded-md relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="space-y-8 lg:w-1/2 p-20">
          <p className="text-[#00ff66] text-sm font-medium">
            {t("page_home.sections.showcase.categories")}
          </p>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t("page_home.sections.showcase.title.1")}
            <br />
            {t("page_home.sections.showcase.title.2")}
          </h1>

          <div className="flex gap-4">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-black text-xl font-bold">{value}</span>
                </div>
                <span className="text-white text-sm mt-2">
                  {t(`page_home.sections.showcase.time.${key}`)}
                </span>
              </div>
            ))}
          </div>

          <Button className="bg-[#00ff66] text-black hover:bg-[#00ff66]/90 px-8 py-6 text-lg font-medium">
            {t("page_home.sections.showcase.buy_button")}
          </Button>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0">
          <div className="relative">
            {/* Add a subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-3xl" />
            <img
              src={imageShowcase}
              alt={imageShowcase}
              className="w-full h-auto max-w-[600px] mx-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
