// src/lazyImports.js

import { lazy } from "react";

// Lazy load page components
export const OverviewPage = lazy(
  () => import("@/elements/pages/Dashboard/OverviewPage.tsx"),
);
export const AnalyticsPage = lazy(
  () => import("@/elements/pages/Dashboard/AnalyticsPage.tsx"),
);
export const ActivityLogPage = lazy(
  () => import("@/elements/pages/Dashboard/ActivityLogPage.tsx"),
);
export const CategoriesPage = lazy(
  () => import("@/elements/pages/Categories/CategoriesPage.tsx"),
);
export const CategoryPage = lazy(
  () => import("@/elements/pages/Categories/CategoryPage.tsx"),
);
export const SubcategoriesPage = lazy(
  () => import("@/elements/pages/Categories/SubcategoriesPage.tsx"),
);
export const SubcategoryPage = lazy(
  () => import("@/elements/pages/Categories/SubcategoryPage.tsx"),
);
export const AllProductsPage = lazy(
  () => import("@/elements/pages/Products/ProductsPage.tsx"),
);
export const ProductPage = lazy(
  () => import("@/elements/pages/Products/ProductPage.tsx"),
);
export const AddProductPage = lazy(
  () => import("@/elements/pages/Products/AddProductPage.tsx"),
);
export const UpdateProductPage = lazy(
  () => import("@/elements/pages/Products/UpdateProductPage.tsx"),
);
export const ProductInventoryPage = lazy(
  () => import("@/elements/pages/Products/ProductInventoryPage.tsx"),
);
export const AllOrdersPage = lazy(
  () => import("@/elements/pages/Orders/AllOrdersPage.tsx"),
);
export const PendingOrdersPage = lazy(
  () => import("@/elements/pages/Orders/PendingOrdersPage.tsx"),
);
export const CompletedOrdersPage = lazy(
  () => import("@/elements/pages/Orders/CompletedOrdersPage.tsx"),
);
export const RefundRequestsPage = lazy(
  () => import("@/elements/pages/Orders/RefundRequestsPage.tsx"),
);
export const AllPromotionsPage = lazy(
  () => import("@/elements/pages/Promotions/AllPromotionsPage.tsx"),
);
export const CreatePromotionPage = lazy(
  () => import("@/elements/pages/Promotions/CreatePromotionPage.tsx"),
);
export const DiscountCodesPage = lazy(
  () => import("@/elements/pages/Promotions/DiscountCodesPage.tsx"),
);
export const AllMailsPage = lazy(
  () => import("@/elements/pages/Mails/AllMailsPage.tsx"),
);
export const ComposeMailsPage = lazy(
  () => import("@/elements/pages/Mails/ComposeMailsPage.tsx"),
);
export const MailsTemplatesPage = lazy(
  () => import("@/elements/pages/Mails/MailsTemplatesPage.tsx"),
);
export const GeneralSettingsPage = lazy(
  () => import("@/elements/pages/Settings/GeneralSettingsPage.tsx"),
);
export const PaymentSettingsPage = lazy(
  () => import("@/elements/pages/Settings/PaymentSettingsPage.tsx"),
);
export const ShippingSettingsPage = lazy(
  () => import("@/elements/pages/Settings/ShippingSettingsPage.tsx"),
);
export const AuthPage = lazy(() => import("@/elements/pages/AuthPage.tsx"));
