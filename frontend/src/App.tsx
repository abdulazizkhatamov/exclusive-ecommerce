import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/elements/layouts/RootLayout.tsx";
import HomePage from "@/elements/pages/RootPages/HomePage.tsx";
import ContactPage from "@/elements/pages/RootPages/ContactPage.tsx";
import AboutPage from "@/elements/pages/RootPages/AboutPage.tsx";
import SigninPage from "@/elements/pages/AuthPages/SigninPage.tsx";
import SignupPage from "@/elements/pages/AuthPages/SignupPage.tsx";
import NotFoundPage from "@/elements/pages/RootPages/NotFoundPage.tsx";
import { useDispatch } from "react-redux";
import useAuthHttpClient from "@/hooks/use-auth.ts";
import { setUser } from "@/features/auth/auth-slice.ts";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/custom/ProtectedRoute.tsx";
import AccountPage from "@/elements/pages/RootPages/AccountPage.tsx";
import { Loader } from "lucide-react";

// Define route configurations
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "404", element: <NotFoundPage /> },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <SigninPage /> },
  { path: "/register", element: <SignupPage /> },
]);

function App() {
  const dispatch = useDispatch();
  const authHttpClient = useAuthHttpClient();

  const [isLoading, setIsLoading] = useState(true);

  const getUserDetail = () => {
    setIsLoading(true);
    authHttpClient
      .get("/api/user")
      .then((res) => dispatch(setUser(res.data)))
      .catch((e) => e)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className={"w-screen h-screen items-center flex justify-center"}>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
