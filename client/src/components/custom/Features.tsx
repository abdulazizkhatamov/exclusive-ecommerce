import React from "react";
import { Headphones, Shield, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeaturesProps {}

const Features: React.FC<FeaturesProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-32 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-7">
          <div className={"p-3 rounded-full bg-primary/10"}>
            <div className="rounded-full bg-black p-4">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <h3 className="font-poppins font-semibold text-[20px] leading-[18px] text-black">
          {t("page_about.features.free_and_fast.title")}
        </h3>
        <p className="font-poppins font-normal text-[14px] leading-[11px] text-center text-black">
          {t("page_about.features.free_and_fast.paragraph")}
        </p>
      </div>
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-7">
          <div className={"p-3 rounded-full bg-primary/10"}>
            <div className="rounded-full bg-black p-4">
              <Headphones className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <h3 className="font-poppins font-semibold text-[20px] leading-[18px] text-black">
          {t("page_about.features.customer_service.title")}
        </h3>
        <p className="font-poppins font-normal text-[14px] leading-[11px] text-center text-black">
          {t("page_about.features.customer_service.paragraph")}
        </p>
      </div>
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-7">
          <div className={"p-3 rounded-full bg-primary/10"}>
            <div className="rounded-full bg-black p-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <h3 className="font-poppins font-semibold text-[20px] leading-[18px] text-black">
          {t("page_about.features.refund_guarantee.title")}
        </h3>
        <p className="font-poppins font-normal text-[14px] leading-[11px] text-center text-black">
          {t("page_about.features.refund_guarantee.paragraph")}
        </p>
      </div>
    </div>
  );
};

export default Features;
