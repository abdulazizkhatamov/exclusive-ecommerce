import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout.tsx";
import CategoriesLayout from "@/layouts/CategoriesLayout.tsx";
import ProductsLayout from "@/layouts/ProductsLayout.tsx";
import OrdersLayout from "@/layouts/OrdersLayout.tsx";
import PromotionsLayout from "@/layouts/PromotionsLayout.tsx";
import MailsLayout from "@/layouts/MailsLayout.tsx";

import SettingsLayout from "@/layouts/SettingsLayout.tsx";
// Lazy-loaded page imports
import * as Pages from "@/utils/lazy-imports.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Pages.OverviewPage /> },
      // { path: "analytics", element: <Pages.AnalyticsPage /> },
      // { path: "activity-log", element: <Pages.ActivityLogPage /> },
      {
        path: "categories",
        element: <CategoriesLayout />,
        children: [
          { index: true, element: <Pages.CategoriesPage /> },
          { path: "category/:_id", element: <Pages.CategoryPage /> },
          { path: "subcategories", element: <Pages.SubcategoriesPage /> },
          { path: "subcategory/:_id", element: <Pages.SubcategoryPage /> },
        ],
      },
      {
        path: "products",
        element: <ProductsLayout />,
        children: [
          { index: true, element: <Pages.AllProductsPage /> },
          { path: "product/:_id", element: <Pages.ProductPage /> },
          { path: "add", element: <Pages.AddProductPage /> },
          { path: "update/:_id", element: <Pages.UpdateProductPage /> },
          { path: "inventory", element: <Pages.ProductInventoryPage /> },
        ],
      },
      {
        path: "orders",
        element: <OrdersLayout />,
        children: [
          { index: true, element: <Pages.AllOrdersPage /> },
          // { path: "refunds", element: <Pages.RefundRequestsPage /> },
        ],
      },
      {
        path: "promotions",
        element: <PromotionsLayout />,
        children: [
          { index: true, element: <Pages.AllPromotionsPage /> },
          { path: "create", element: <Pages.CreatePromotionPage /> },
          // { path: "discount-codes", element: <Pages.DiscountCodesPage /> },
        ],
      },
      {
        path: "mails",
        element: <MailsLayout />,
        children: [
          { index: true, element: <Pages.MailsPage /> },
          { path: "trash", element: <Pages.MailsPage /> },
          { path: "accounts", element: <Pages.MailAccountsPage /> },
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
