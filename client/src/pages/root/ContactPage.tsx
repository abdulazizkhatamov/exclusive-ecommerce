import React from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Mail className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {t("page_contact.write_us.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("page_contact.write_us.paragraph")}
              </p>
              <p className="mt-1 text-sm">{t("page_contact.write_us.1")}</p>
              <p className="mt-1 text-sm">{t("page_contact.write_us.2")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-6">
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                className="bg-background"
                placeholder={t("page_contact.form.inputs.name.placeholder")}
                required
                type="text"
              />
              <Input
                className="bg-background"
                placeholder={t("page_contact.form.inputs.email.placeholder")}
                required
                type="email"
              />
            </div>
            <Input
              className="bg-background"
              placeholder={t("page_contact.form.inputs.phone.placeholder")}
              required
              type="tel"
            />
            <Textarea
              className="min-h-[150px] bg-background"
              placeholder={t("page_contact.form.inputs.message.placeholder")}
              required
            />
            <div className={"flex w-full justify-end"}>
              <Button className="w-full bg-red-500 text-white hover:bg-red-600 sm:w-auto">
                {t("page_contact.form.submit_button")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
