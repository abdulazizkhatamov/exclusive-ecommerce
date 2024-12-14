import React from "react";
import imageSideImage from "@/assets/side_image.png";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { postLoginAccount } from "@/api/api.ts";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AlertCircle, Loader } from "lucide-react";
import HeaderNavigation from "@/components/custom/headerNavigation/HeaderNavigation.tsx";
import Footer from "@/components/custom/Footer.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { setAccessToken } from "@/helper/token.ts";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/authSlice.ts";

interface SigninPageProps {}

const SigninPage: React.FC<SigninPageProps> = ({}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SigninValidationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("errors.auth.email_required"))
      .email(t("errors.auth.email_required")),
    password: Yup.string()
      .required(t("errors.auth.password_required"))
      .min(6, t("errors.auth.min_6_password")),
  });

  const mutation = useMutation({
    mutationFn: postLoginAccount,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      dispatch(setUser(data.user));
      navigate("/account");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninValidationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

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
                {t("page_auth.login.title")}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {t("page_auth.login.paragraph")}
              </p>
            </div>
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
                        `errors.auth.login.backend_responses.${mutation.error.message}`,
                      )
                    : t("errors.error_occurred")}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("page_auth.login.inputs.email.label")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="off"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`border rounded px-3 py-2 ${
                    formik.errors.email && formik.touched.email
                      ? "border-primary_red"
                      : "border-gray-300"
                  }`}
                  value={formik.values.email}
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
                    {t("page_auth.login.inputs.password.label")}
                  </Label>
                  <Link to="#" className="text-sm font-medium underline">
                    {t("page_auth.login.forgot_password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("page_auth.login.inputs.password.placeholder")}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`border rounded px-3 py-2 ${
                    formik.errors.password && formik.touched.password
                      ? "border-primary_red"
                      : "border-gray-300"
                  }`}
                  value={formik.values.password}
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
              >
                {mutation.isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {t("page_auth.login.submitting_button")}
                  </>
                ) : (
                  t("page_auth.login.submit_button")
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default SigninPage;
