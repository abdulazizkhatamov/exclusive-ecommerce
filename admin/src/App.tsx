import { useEffect, useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/features/auth/auth-slice.ts";
import useAuthHttpClient from "@/hooks/use-auth.ts";
import { Loader } from "lucide-react";

import RootLayout from "@/elements/layouts/RootLayout.tsx";
import CategoriesLayout from "@/elements/layouts/CategoriesLayout.tsx";
import ProductsLayout from "@/elements/layouts/ProductsLayout.tsx";
import OrdersLayout from "@/elements/layouts/OrdersLayout.tsx";
import PromotionsLayout from "@/elements/layouts/PromotionsLayout.tsx";
import MailsLayout from "@/elements/layouts/MailsLayout.tsx";
import SettingsLayout from "@/elements/layouts/SettingsLayout.tsx";

// Lazy-loaded page imports
import * as Pages from "@/utils/lazy-imports.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Pages.OverviewPage /> },
      { path: "analytics", element: <Pages.AnalyticsPage /> },
      { path: "activity-log", element: <Pages.ActivityLogPage /> },
      {
        path: "categories",
        element: <CategoriesLayout />,
        children: [
          { index: true, element: <Pages.AllCategoriesPage /> },
          { path: "add", element: <Pages.AddCategoryPage /> },
          { path: "subcategories", element: <Pages.SubcategoriesPage /> },
        ],
      },
      {
        path: "products",
        element: <ProductsLayout />,
        children: [
          { index: true, element: <Pages.AllProductsPage /> },
          { path: "add", element: <Pages.AddCategoryPage /> },
          { path: "variants", element: <Pages.ProductVariantPage /> },
          { path: "inventory", element: <Pages.ProductInventoryPage /> },
        ],
      },
      {
        path: "orders",
        element: <OrdersLayout />,
        children: [
          { index: true, element: <Pages.AllOrdersPage /> },
          { path: "pending", element: <Pages.PendingOrdersPage /> },
          { path: "completed", element: <Pages.CompletedOrdersPage /> },
          { path: "refunds", element: <Pages.RefundRequestsPage /> },
        ],
      },
      {
        path: "promotions",
        element: <PromotionsLayout />,
        children: [
          { index: true, element: <Pages.AllPromotionsPage /> },
          { path: "create", element: <Pages.CreatePromotionPage /> },
          { path: "discount-codes", element: <Pages.DiscountCodesPage /> },
        ],
      },
      {
        path: "mails",
        element: <MailsLayout />,
        children: [
          { index: true, element: <Pages.AllMailsPage /> },
          { path: "compose", element: <Pages.ComposeMailsPage /> },
          { path: "templates", element: <Pages.MailsTemplatesPage /> },
        ],
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Pages.GeneralSettingsPage /> },
          { path: "payment", element: <Pages.PaymentSettingsPage /> },
          { path: "shipping", element: <Pages.ShippingSettingsPage /> },
        ],
      },
    ],
  },
  { path: "/auth", element: <Pages.AuthPage /> },
]);

function App() {
  const dispatch = useDispatch();
  const authHttpClient = useAuthHttpClient();
  const [isLoading, setIsLoading] = useState(true);

  const getAdminDetails = () => {
    setIsLoading(true);
    authHttpClient
      .get("/api/admin")
      .then((res) => dispatch(setAdmin(res.data)))
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    // Avoid setting state after component unmounts
    if (isMounted) {
      getAdminDetails();
    }

    return () => {
      isMounted = false; // Cleanup: mark the component as unmounted
    };
  }, []); // This effect runs only once when the component mounts

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
