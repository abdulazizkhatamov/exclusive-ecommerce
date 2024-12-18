import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import {
  getAdminExistence,
  postCreateAccount,
  postLoginAccount,
} from "@/api/api-auth.ts";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setAdmin } from "@/features/auth/auth-slice.ts";
import { RootState } from "@/app/store.ts";

// Validation schema for both forms
const yupParams = {
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
};

const loginValidationSchema = Yup.object().shape(yupParams);
const registerValidationSchema = Yup.object().shape(yupParams);

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (accessToken) navigate("/");

  const loginMutation = useMutation({
    mutationFn: postLoginAccount,
    onSuccess: (response) => {
      dispatch(setAccessToken(response.accessToken));
      dispatch(setAdmin(response.admin));
      navigate("/");
    },
  });
  const registerMutation = useMutation({
    mutationFn: postCreateAccount,
    onSuccess: (response) => {
      dispatch(setAdmin(response.admin));
      dispatch(setAccessToken(response.accessToken));
      navigate("/");
    },
  });
  const { data: isAdminExist } = useQuery({
    queryKey: ["admin-existence"],
    queryFn: getAdminExistence,
  });

  const loginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      registerMutation.mutate(values);
    },
  });

  return (
    <div className="w-screen h-screen flex items-center">
      <div className="max-w-max mx-auto">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="register" disabled={isAdminExist}>
              Sign up
            </TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <form onSubmit={loginFormik.handleSubmit}>
                <CardHeader>
                  <CardTitle>Sign in</CardTitle>
                  <CardDescription>
                    Sign in to access your admin dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={loginFormik.values.username}
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                    />
                    {loginFormik.touched.username &&
                      loginFormik.errors.username && (
                        <div className="text-red-500 text-sm">
                          {loginFormik.errors.username}
                        </div>
                      )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginFormik.values.password}
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                    />
                    {loginFormik.touched.password &&
                      loginFormik.errors.password && (
                        <div className="text-red-500 text-sm">
                          {loginFormik.errors.password}
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loginMutation.isLoading}>
                    {loginMutation.isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </CardFooter>
                {loginMutation.isError && (
                  <div
                    className={
                      "p-3 rounded-b-md bg-red-100 text-[0.85rem] text-primary_red items-center"
                    }
                  >
                    <AlertCircle className={"w-4 h-4 inline-block mr-3"} />
                    {loginMutation.error instanceof Error &&
                      loginMutation.error.message}
                  </div>
                )}
              </form>
            </Card>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <form onSubmit={registerFormik.handleSubmit}>
                <CardHeader>
                  <CardTitle>Sign up</CardTitle>
                  <CardDescription>
                    Create an account to access the admin dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={registerFormik.values.username}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                    />
                    {registerFormik.touched.username &&
                      registerFormik.errors.username && (
                        <div className="text-red-500 text-sm">
                          {registerFormik.errors.username}
                        </div>
                      )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={registerFormik.values.password}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                    />
                    {registerFormik.touched.password &&
                      registerFormik.errors.password && (
                        <div className="text-red-500 text-sm">
                          {registerFormik.errors.password}
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={registerMutation.isLoading}>
                    {registerMutation.isLoading ? "Signing up..." : "Sign up"}
                  </Button>
                </CardFooter>
                {registerMutation.isError && (
                  <div
                    className={
                      "p-3 rounded-b-md bg-red-100 text-[0.85rem] text-primary_red items-center"
                    }
                  >
                    <AlertCircle className={"w-4 h-4 inline-block mr-3"} />
                    {registerMutation.error instanceof Error &&
                      registerMutation.error.message}
                  </div>
                )}
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
