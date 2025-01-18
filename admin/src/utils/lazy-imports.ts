// src/lazyImports.js

import { lazy } from "react";

// Lazy load page components
export const OverviewPage = lazy(
  () => import("@/pages/Dashboard/OverviewPage.tsx"),
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

export const AllPromotionsPage = lazy(
  () => import("@/pages/Promotions/AllPromotionsPage.tsx"),
);
export const CreatePromotionPage = lazy(
  () => import("@/pages/Promotions/CreatePromotionPage.tsx"),
);

export const MailsPage = lazy(() => import("@/pages/Mails/MailsPage.tsx"));

export const MailAccountsPage = lazy(
  () => import("@/pages/Mails/MailAccountsPage.tsx"),
);

export const ChatsPage = lazy(() => import("@/pages/Chats/ChatsPage.tsx"));

export const ChatAccountsPage = lazy(
  () => import("@/pages/Chats/ChatAccountsPage.tsx"),
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
