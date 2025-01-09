import React from "react";
import imageSideImage from "@/assets/side_image.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "@/components/custom/Footer.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import HeaderNavigation from "@/components/custom/header-navigation/HeaderNavigation.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import SignUpForm from "@/features/auth/SignUpForm.tsx";

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (user) navigate("/");

  return (
    <>
      <HeaderNavigation />
      <div className="mt-10 font-inter grid min-h-[80vh] w-full grid-cols-1 lg:grid-cols-2">
        <div className="hidden bg-gray-100 lg:block dark:bg-gray-800">
          <img
            src={imageSideImage}
            alt="Login Illustration"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
          />
        </div>
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="mx-auto w-full max-w-[400px] space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {t("page_auth.register.title")}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {t("page_auth.register.paragraph")}
              </p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default SignUpPage;
