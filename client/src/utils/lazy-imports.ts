import { lazy } from "react";

// Lazy load page components
export const HomePage = lazy(() => import("@/pages/root/HomePage.tsx"));

export const ProductsPage = lazy(
  () => import("@/pages/products/ProductsPage.tsx"),
);

export const CategoryProductsPage = lazy(
  () => import("@/pages/products/CategoryProductsPage.tsx"),
);

export const BestSellingProductsPage = lazy(
  () => import("@/pages/products/BestSellingProductsPage.tsx"),
);

export const ProductPage = lazy(() => import("@/pages/root/ProductPage.tsx"));

export const ContactPage = lazy(() => import("@/pages/root/ContactPage.tsx"));

export const AboutPage = lazy(() => import("@/pages/root/AboutPage.tsx"));

export const NotFoundPage = lazy(() => import("@/pages/root/NotFoundPage.tsx"));

export const ProtectedRoute = lazy(
  () => import("@/components/custom/ProtectedRoute.tsx"),
);

export const AccountPage = lazy(
  () => import("@/pages/root/account/AccountPage.tsx"),
);

export const OrdersPage = lazy(
  () => import("@/pages/root/account/OrdersPage.tsx"),
);

export const CartPage = lazy(() => import("@/pages/root/CartPage.tsx"));

export const CheckoutPage = lazy(() => import("@/pages/root/CheckoutPage.tsx"));

export const SignInPage = lazy(() => import("@/pages/auth/SignInPage.tsx"));

export const SignUpPage = lazy(() => import("@/pages/auth/SignUpPage.tsx"));

export const VerifyEmailPage = lazy(
  () => import("@/pages/auth/VerifyEmailPage.tsx"),
);
