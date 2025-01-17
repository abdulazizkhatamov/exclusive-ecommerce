import React from "react";
import PrimaryTextInput from "@/components/custom/inputs/PrimaryTextInput/PrimaryTextInput.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { postSubmitMessage } from "@/features/contact/requests.ts";
import { useFormik } from "formik";
import { useToast } from "@/hooks/use-toast.ts";

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: postSubmitMessage,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      mutation.mutate(values, {
        onSuccess: () => {
          toast({
            title: "Message submitted",
            description:
              "You have successfully submitted a message. We will reach you as soon as possible.",
          });
          resetForm();
        },
      }); // submit the form data
    },
  });

  return (
    <div className="rounded-lg shadow-md p-6">
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className={"w-full"}>
            <PrimaryTextInput
              className="w-full bg-muted/50 py-2 px-3 rounded-md placeholder:text-[1rem] placeholder:text-black/50"
              placeholder={t("page_contact.form.inputs.name.placeholder")}
              required
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
            />
          </div>
          <div className={"w-full"}>
            <PrimaryTextInput
              className="w-full bg-muted/50 py-2 px-3 rounded-md placeholder:text-[1rem] placeholder:text-black/50"
              placeholder={t("page_contact.form.inputs.email.placeholder")}
              required
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name="email"
            />
          </div>
          <div className={"w-full"}>
            <PrimaryTextInput
              className="w-full bg-muted/50 py-2 px-3 rounded-md placeholder:text-[1rem] placeholder:text-black/50"
              placeholder={t("page_contact.form.inputs.phone.placeholder")}
              required
              type="tel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              name="phone"
            />
          </div>
        </div>
        <div>
          <Textarea
            className="min-h-[150px] border-none bg-muted/50 py-2 px-3 rounded-md focus-visible:ring-0 placeholder:text-[1rem] placeholder:text-black/50"
            placeholder={t("page_contact.form.inputs.message.placeholder")}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
            name="message"
          />
        </div>
        <div className={"flex w-full justify-end"}>
          <Button
            className="w-full bg-red-500 text-white hover:bg-red-600 sm:w-auto"
            type="submit"
          >
            {t("page_contact.form.submit_button")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
