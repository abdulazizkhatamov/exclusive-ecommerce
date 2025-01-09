import React from "react";
import { Link } from "react-router-dom";

import imageFeaturedPS5 from "@/assets/featured_ps5.png";
import imageFeaturedWoman from "@/assets/featured_woman.png";
import imageFromFeaturedSpeakers from "@/assets/featured_speakers.png";
import imageFeaturedPerfume from "@/assets/featured_perfume.png";
import { useTranslation } from "react-i18next";

const Featured: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="my-20 container mx-auto px-4">
      <div className={"my-10"}>
        <h3
          className={
            "mb-5 border-l-8 border-l-primary_red pl-4 font-poppins font-semibold text-[1rem] leading-[1.25rem] text-primary_red"
          }
        >
          {t("page_home.sections.featured.red_title")}
        </h3>
        <div className={"flex justify-between items-center"}>
          <div>
            <h1
              className={
                "font-inter font-semibold text-[2.25rem] leading-[3rem] tracking-[0.04em] text-black"
              }
            >
              {t("page_home.sections.featured.title")}
            </h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-lg bg-black">
          <Link to="/playstation" className="block">
            <img
              src={imageFeaturedPS5}
              alt="PlayStation 5 Black and White"
              width={500}
              height={500}
              className="absolute bottom-0 left-20 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t("page_home.sections.featured.items.ps5.title")}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {t("page_home.sections.featured.items.ps5.paragraph")}
                </p>
                <span className="inline-block px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
                  {t("page_home.sections.featured.shop_now_button")}
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="lg:col-span-2 relative group overflow-hidden rounded-lg bg-black">
          <Link to="/womens-collections" className="block">
            <img
              src={imageFeaturedWoman}
              alt={imageFeaturedWoman}
              className="object-contain w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {t("page_home.sections.featured.items.woman.title")}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {t("page_home.sections.featured.items.woman.paragraph")}
                </p>
                <span className="inline-block px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
                  {t("page_home.sections.featured.shop_now_button")}
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="relative group overflow-hidden rounded-lg bg-black py-10">
          <Link to="/speakers" className="block">
            <img
              src={imageFromFeaturedSpeakers}
              alt={imageFromFeaturedSpeakers}
              width={150}
              height={150}
              className="object-contain mx-auto max-w-max"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-bold text-white mb-1">
                  {t("page_home.sections.featured.items.speakers.title")}
                </h3>
                <p className="text-gray-300 text-xs mb-2">
                  {t("page_home.sections.featured.items.speakers.paragraph")}
                </p>
                <span className="inline-block px-3 py-1 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-100 transition-colors">
                  {t("page_home.sections.featured.shop_now_button")}
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="relative group overflow-hidden rounded-lg bg-black py-10">
          <Link to="/perfume" className="block">
            <img
              src={imageFeaturedPerfume}
              alt="Gucci Perfume"
              width={150}
              height={150}
              className="object-contain mx-auto  max-w-max"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-bold text-white mb-1">
                  {t("page_home.sections.featured.items.perfume.title")}
                </h3>
                <p className="text-gray-300 text-xs mb-2">
                  {t("page_home.sections.featured.items.perfume.paragraph")}
                </p>
                <span className="inline-block px-3 py-1 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-100 transition-colors">
                  {t("page_home.sections.featured.shop_now_button")}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
