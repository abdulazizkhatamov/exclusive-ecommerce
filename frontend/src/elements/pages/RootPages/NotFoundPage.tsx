import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = ({}) => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center">
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
            <li className="text-primary">{t("errors.404.error")}</li>
          </ol>
        </nav>

        <div className="mt-20 max-w-full text-center">
          <h1 className="font-inter font-medium text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] leading-tight tracking-[0.03em] text-black">
            {t("errors.404.title")}
          </h1>
          <p className="my-6 sm:my-8 font-poppins text-[0.875rem] sm:text-[1rem] md:text-[1.125rem] leading-relaxed text-black">
            {t("errors.404.paragraph")}
          </p>
          <Link to="/">
            <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-primary_red font-poppins text-[0.875rem] sm:text-[1rem] leading-5 sm:leading-6 text-white rounded hover:bg-red-600 transition-colors">
              {t("errors.404.back_button")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
