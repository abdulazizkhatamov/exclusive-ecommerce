import React from "react";
import { AlertCircle, Loader } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { setAccessToken, setUser } from "@/features/auth/auth-slice.ts";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { postLoginAccount } from "@/features/auth/reqests.ts";

const SignInForm: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignInValidationSchema = Yup.object().shape({
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
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user));
      navigate("/account");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SignInValidationSchema,
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
          {mutation.error instanceof Error ? (
            <>
              {t(
                `errors.auth.login.backend_responses.${mutation.error.message}`,
              )}
            </>
          ) : (
            t("errors.error_occurred")
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">{t("page_auth.login.inputs.email.label")}</Label>
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
      <Button type="submit" className="w-full bg-primary_red hover:bg-red-600">
        {mutation.isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
            {t("page_auth.login.submitting_button")}
          </>
        ) : (
          t("page_auth.login.submit_button")
        )}
      </Button>
      <div className={"pt-4 flex justify-between"}>
        <p>{t("page_auth.login.isnot_exist_account.question")}</p>
        <Link to="/signup" className="text-sm font-medium underline">
          {t("page_auth.login.isnot_exist_account.link")}
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
