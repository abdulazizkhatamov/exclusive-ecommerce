import { useQuery } from "react-query";
import { authHttpClient } from "@/api/api.ts";

// Hook for analytics queries
export const useAnalytics = {
  // User quantity
  useUserQuantity: () =>
    useQuery("userQuantity", async () => {
      const { data } = await authHttpClient.get(
        "/api/analytics/users-qty-dashboard",
      );
      return data;
    }),
  useSalesQuantity: () =>
    useQuery("salesQuantity", async () => {
      const { data } = await authHttpClient.get(
        "/api/analytics/sales-qty-dashboard",
      );
      return data;
    }),
  useRecentSales: () =>
    useQuery("recentSales", async () => {
      const { data } = await authHttpClient.get(
        "/api/analytics/recent-sales-dashboard",
      );
      return data;
    }),
  // Category Distributions
  useCategoryDistributions: () =>
    useQuery("categoryDistributions", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/category-distributions",
      );
      return data;
    }),

  // Category Performances
  useCategoryPerformances: () =>
    useQuery("categoryPerformances", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/category-performances",
      );
      return data;
    }),

  // Category Statuses
  useCategoryStatuses: () =>
    useQuery("categoryStatuses", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/category-statuses",
      );
      return data;
    }),

  // Product Inventory
  useProductInventory: () =>
    useQuery("productInventory", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/product-inventory",
      );
      return data;
    }),

  // Top-Selling Products
  useTopSellingProducts: () =>
    useQuery("topSellingProducts", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/top-selling-products",
      );
      return data;
    }),

  // Product Ratings
  useProductRatings: () =>
    useQuery("productRatings", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/product-ratings",
      );
      return data;
    }),

  // Discount Impacts
  useDiscountImpacts: () =>
    useQuery("discountImpacts", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/discount-impacts",
      );
      return data;
    }),

  // Sales by Variants
  useSalesByVariants: () =>
    useQuery("salesByVariants", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/sales-by-variants",
      );
      return data;
    }),

  // Variant Stock
  useVariantStock: () =>
    useQuery("variantStock", async () => {
      const { data } = await authHttpClient.get("api/analytics/variant-stock");
      return data;
    }),

  // Order Status Distribution
  useOrderStatusDistribution: () =>
    useQuery("orderStatusDistribution", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/order-status-distribution",
      );
      return data;
    }),

  // Revenue Trends
  useRevenueTrends: () =>
    useQuery("revenueTrends", async () => {
      const { data } = await authHttpClient.get("api/analytics/revenue-trends");
      return data;
    }),

  // Payment Method Usage
  usePaymentMethodUsage: () =>
    useQuery("paymentMethodUsage", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/payment-method-usage",
      );
      return data;
    }),

  // Peak Order Times
  usePeakOrderTimes: () =>
    useQuery("peakOrderTimes", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/peak-order-times",
      );
      return data;
    }),

  // Sales Funnel
  useSalesFunnel: () =>
    useQuery("salesFunnel", async () => {
      const { data } = await authHttpClient.get("api/analytics/sales-funnel");
      return data;
    }),

  // Seasonal Trends
  useSeasonalTrends: () =>
    useQuery("seasonalTrends", async () => {
      const { data } = await authHttpClient.get(
        "api/analytics/seasonal-trends",
      );
      return data;
    }),
};
