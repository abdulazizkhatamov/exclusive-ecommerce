// Define route configurations
import { createBrowserRouter } from "react-router-dom";
import * as Pages from "@/utils/lazy-imports.ts";

import RootLayout from "@/layouts/RootLayout.tsx";
import AccountLayout from "@/layouts/AccountLayout.tsx";
import ProductsLayout from "@/layouts/ProductsLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Pages.HomePage /> },
      { path: "contact", element: <Pages.ContactPage /> },
      { path: "about", element: <Pages.AboutPage /> },
      { path: "product/:_id", element: <Pages.ProductPage /> },
      {
        path: "account",
        element: (
          <Pages.ProtectedRoute>
            <AccountLayout />
          </Pages.ProtectedRoute>
        ),
        children: [
          { index: true, element: <Pages.AccountPage /> },
          { path: "orders", element: <Pages.OrdersPage /> },
        ],
      },
      {
        path: "cart",
        element: (
          <Pages.ProtectedRoute>
            <Pages.CartPage />
          </Pages.ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <Pages.ProtectedRoute>
            <Pages.CheckoutPage />
          </Pages.ProtectedRoute>
        ),
      },
      { path: "404", element: <Pages.NotFoundPage /> },
    ],
  },
  {
    path: "/products",
    element: <ProductsLayout />,
    children: [
      { index: true, element: <Pages.ProductsPage /> },
      { path: "category/:id", element: <Pages.CategoryProductsPage /> },
      { path: "best-selling", element: <Pages.BestSellingProductsPage /> },
    ],
  },
  { path: "/signin", element: <Pages.SignInPage /> },
  { path: "/signup", element: <Pages.SignUpPage /> },
  { path: "/verify-email", element: <Pages.VerifyEmailPage /> },
]);
