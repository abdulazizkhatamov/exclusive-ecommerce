import React from "react";
import { AlertCircle, Loader } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast.ts";
import { postCreateAccount } from "@/features/auth/reqests.ts";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const SignupValidationSchema = Yup.object().shape({
    fullName: Yup.string().required(t("errors.auth.fullName_required")),
    email: Yup.string()
      .required(t("errors.auth.email_required"))
      .email(t("errors.auth.email_required")),
    password: Yup.string()
      .required(t("errors.auth.password_required"))
      .min(6, t("errors.auth.min_6_password")),
  });

  const mutation = useMutation({
    mutationFn: postCreateAccount,
    onSuccess: () => {
      toast({
        description: t("page_auth.register.backend_responses.success"),
      });
      navigate("/signin");
    },
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: SignupValidationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {mutation.isError && (
        <div
          className={
            "p-3 rounded-md bg-red-100 text-[0.85rem] text-primary_red items-center"
          }
        >
          <AlertCircle className={"w-4 h-4 inline-block mr-3"} />
          {mutation.error instanceof Error
            ? t(
                `errors.auth.register.backend_responses.${mutation.error.message}`,
              )
            : t("errors.error_occurred")}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">
          {t("page_auth.register.inputs.full_name.label")}
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder={t("page_auth.register.inputs.full_name.placeholder")}
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Track when the field is blurred
          value={formik.values.fullName}
          className={`border rounded px-3 py-2 ${
            formik.errors.fullName && formik.touched.fullName
              ? "border-primary_red"
              : "border-gray-300"
          }`}
        />
        {formik.errors.fullName && formik.touched.fullName && (
          <div className="text-xs text-primary_red mt-1">
            {formik.errors.fullName}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          {t("page_auth.register.inputs.email.label")}
        </Label>
        <Input
          id="email"
          type="text"
          placeholder="m@example.com"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Track when the field is blurred
          value={formik.values.email}
          className={`border rounded px-3 py-2 focus:outline-none ${
            formik.errors.email && formik.touched.email
              ? "border-primary_red"
              : "border-gray-300"
          }`}
        />
        {formik.errors.email && formik.touched.email && (
          <div className="text-xs text-primary_red mt-1">
            {formik.errors.email}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">
            {t("page_auth.register.inputs.password.label")}
          </Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={t("page_auth.register.inputs.password.placeholder")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Track when the field is blurred
          value={formik.values.password}
          className={`border rounded px-3 py-2 focus:outline-none ${
            formik.errors.password && formik.touched.password
              ? "border-primary_red"
              : "border-gray-300"
          }`}
        />
        {formik.errors.password && formik.touched.password && (
          <div className="text-xs text-primary_red mt-1">
            {formik.errors.password}
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-primary_red hover:bg-red-600"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
            {t("page_auth.register.submitting_button")}
          </>
        ) : (
          t("page_auth.register.submit_button")
        )}
      </Button>
      <div className={"pt-4 flex justify-between"}>
        <p>{t("page_auth.register.is_exist_account.question")}</p>
        <Link to="/signin" className="text-sm font-medium underline">
          {t("page_auth.register.is_exist_account.link")}
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
