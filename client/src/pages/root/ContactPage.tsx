import React from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PhoneDetails from "@/features/contact/components/PhoneDetails.tsx";
import MailDetails from "@/features/contact/components/MailDetails.tsx";
import ContactForm from "@/features/contact/ContactForm.tsx";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-primary">
              {t("home")}
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-primary">{t("contact")}</li>
        </ol>
      </nav>
      <div className="mt-10 mb-20 grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <div>
            <PhoneDetails />
            <MailDetails />
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
