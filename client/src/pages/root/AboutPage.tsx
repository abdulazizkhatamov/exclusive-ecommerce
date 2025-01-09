import React from "react";
import { DollarSign, Store, Users, Wallet } from "lucide-react";
import imageShoppingExperience from "@/assets/about_shopping_experience.png";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
import TeamMemberCard from "@/components/custom/TeamMemberCard.tsx";
import imageTeamMember from "@/assets/team_member.png";
import { useTranslation } from "react-i18next";
import Features from "@/components/custom/Features.tsx";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Professional 1",
      role: "Founder & Chairman",
      image: imageTeamMember,
    },
    {
      name: "Professional 2",
      role: "Managing Director",
      image: imageTeamMember,
    },
    {
      name: "Professional 3",
      role: "Product Designer",
      image: imageTeamMember,
    },
    {
      name: "Professional 4",
      role: "Product Designer",
      image: imageTeamMember,
    },
    {
      name: "Professional 5",
      role: "Product Designer",
      image: imageTeamMember,
    },
  ];

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-primary">
                {t("home")}
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-primary">{t("about")}</li>
          </ol>
        </nav>

        <div className="mt-10 mb-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6">
            <h1 className="font-inter font-semibold text-[54px] leading-[64px] tracking-[0.06em] text-justify text-black">
              {t("page_about.title")}
            </h1>
            <div className="space-y-4">
              <p className="font-poppins font-normal text-[16px] leading-[26px] text-black">
                {t("page_about.primary_paragraph")}
              </p>
              <p className="font-poppins font-normal text-[16px] leading-[26px] text-black">
                {t("page_about.secondary_paragraph")}
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={imageShoppingExperience}
              alt="Shopping experience"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="my-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group p-10 border rounded-lg text-center hover:bg-primary_red hover:text-white hover:shadow-lg cursor-pointer transition-all duration-200">
            <div className="w-max p-3 bg-primary/10 group-hover:bg-secondary/10 rounded-full mb-4 mx-auto">
              <div
                className={
                  "rounded-full w-10 h-10 bg-black group-hover:bg-white flex items-center justify-center"
                }
              >
                <Store className="text-white group-hover:text-black" />
              </div>
            </div>
            <div className="font-inter font-bold text-[32px] leading-[30px] tracking-[0.04em] ">
              10.5k
            </div>
            <p className="mt-4 font-poppins font-normal text-[16px] leading-[24px] text-center text-muted-foreground group-hover:text-white">
              {t("page_about.stats.active_sellers")}
            </p>
          </div>

          <div className="group p-10 border rounded-lg text-center hover:bg-primary_red hover:text-white hover:shadow-lg cursor-pointer transition-all duration-200">
            <div className="w-max p-3 bg-primary/10 group-hover:bg-secondary/10 rounded-full mb-4 mx-auto">
              <div
                className={
                  "rounded-full w-10 h-10 bg-black group-hover:bg-white flex items-center justify-center"
                }
              >
                <DollarSign className="text-white group-hover:text-black" />
              </div>
            </div>
            <div className="font-inter font-bold text-[32px] leading-[30px] tracking-[0.04em] ">
              33k
            </div>
            <p className="mt-4 font-poppins font-normal text-[16px] leading-[24px] text-center text-muted-foreground group-hover:text-white">
              {t("page_about.stats.monthly_sales")}
            </p>
          </div>

          <div className="group p-10 border rounded-lg text-center hover:bg-primary_red hover:text-white hover:shadow-lg cursor-pointer transition-all duration-200">
            <div className="w-max p-3 bg-primary/10 group-hover:bg-secondary/10 rounded-full mb-4 mx-auto">
              <div
                className={
                  "rounded-full w-10 h-10 bg-black group-hover:bg-white flex items-center justify-center"
                }
              >
                <Users className="text-white group-hover:text-black" />
              </div>
            </div>
            <div className="font-inter font-bold text-[32px] leading-[30px] tracking-[0.04em] ">
              45.5k
            </div>
            <p className="mt-4 font-poppins font-normal text-[16px] leading-[24px] text-center text-muted-foreground group-hover:text-white">
              {t("page_about.stats.active_customers")}
            </p>
          </div>

          <div className="group p-10 border rounded-lg text-center hover:bg-primary_red hover:text-white hover:shadow-lg cursor-pointer transition-all duration-200">
            <div className="w-max p-3 bg-primary/10 group-hover:bg-secondary/10 rounded-full mb-4 mx-auto">
              <div
                className={
                  "rounded-full w-10 h-10 bg-black group-hover:bg-white flex items-center justify-center"
                }
              >
                <Wallet className="text-white group-hover:text-black" />
              </div>
            </div>
            <div className="font-inter font-bold text-[32px] leading-[30px] tracking-[0.04em] ">
              25k
            </div>
            <p className="mt-4 font-poppins font-normal text-[16px] leading-[24px] text-center text-muted-foreground group-hover:text-white">
              {t("page_about.stats.annual_gross")}
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="relative my-20">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-1">
              {teamMembers.map((_, index) => (
                <CarouselItem
                  key={index}
                  className="max-w-sm md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <TeamMemberCard
                      name={_.name}
                      role={_.role}
                      imageUrl={_.image}
                      socialLinks={{
                        twitter: "https://twitter.com",
                        instagram: "https://instagram.com",
                        linkedin: "https://linkedin.com",
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Features Section */}
        <Features />
      </div>
    </section>
  );
};

export default AboutPage;
