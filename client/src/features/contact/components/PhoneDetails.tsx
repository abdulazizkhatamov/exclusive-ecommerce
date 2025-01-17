import React from "react";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const PhoneDetails: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Phone className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {t("page_contact.call_us.title")}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("page_contact.call_us.paragraph")}
      </p>
      <p className="mt-1 text-sm">{t("page_contact.call_us.1")}</p>
    </div>
  );
};

export default PhoneDetails;
