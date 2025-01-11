// src/lazyImports.js

import { lazy } from "react";

// Lazy load page components
export const OverviewPage = lazy(
  () => import("@/pages/Dashboard/OverviewPage.tsx"),
);
export const AnalyticsPage = lazy(
  () => import("@/pages/Dashboard/AnalyticsPage.tsx"),
);
export const ActivityLogPage = lazy(
  () => import("@/pages/Dashboard/ActivityLogPage.tsx"),
);
export const CategoriesPage = lazy(
  () => import("@/pages/Categories/CategoriesPage.tsx"),
);
export const CategoryPage = lazy(
  () => import("@/pages/Categories/CategoryPage.tsx"),
);
export const SubcategoriesPage = lazy(
  () => import("@/pages/Categories/SubcategoriesPage.tsx"),
);
export const SubcategoryPage = lazy(
  () => import("@/pages/Categories/SubcategoryPage.tsx"),
);
export const AllProductsPage = lazy(
  () => import("@/pages/Products/ProductsPage.tsx"),
);
export const ProductPage = lazy(
  () => import("@/pages/Products/ProductPage.tsx"),
);
export const AddProductPage = lazy(
  () => import("@/pages/Products/AddProductPage.tsx"),
);
export const UpdateProductPage = lazy(
  () => import("@/pages/Products/UpdateProductPage.tsx"),
);
export const ProductInventoryPage = lazy(
  () => import("@/pages/Products/ProductInventoryPage.tsx"),
);
export const AllOrdersPage = lazy(
  () => import("@/pages/Orders/AllOrdersPage.tsx"),
);
export const RefundRequestsPage = lazy(
  () => import("@/pages/Orders/RefundRequestsPage.tsx"),
);
export const AllPromotionsPage = lazy(
  () => import("@/pages/Promotions/AllPromotionsPage.tsx"),
);
export const CreatePromotionPage = lazy(
  () => import("@/pages/Promotions/CreatePromotionPage.tsx"),
);
export const DiscountCodesPage = lazy(
  () => import("@/pages/Promotions/DiscountCodesPage.tsx"),
);
export const AllMailsPage = lazy(
  () => import("@/pages/Mails/AllMailsPage.tsx"),
);
export const ComposeMailsPage = lazy(
  () => import("@/pages/Mails/ComposeMailsPage.tsx"),
);
export const MailsTemplatesPage = lazy(
  () => import("@/pages/Mails/MailsTemplatesPage.tsx"),
);
export const GeneralSettingsPage = lazy(
  () => import("@/pages/Settings/GeneralSettingsPage.tsx"),
);
export const PaymentSettingsPage = lazy(
  () => import("@/pages/Settings/PaymentSettingsPage.tsx"),
);
export const ShippingSettingsPage = lazy(
  () => import("@/pages/Settings/ShippingSettingsPage.tsx"),
);
export const AuthPage = lazy(() => import("@/pages/AuthPage.tsx"));
