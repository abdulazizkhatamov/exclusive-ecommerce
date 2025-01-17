const express = require("express");
const authenticate = require("../middlewares/admin-auth");

const router = express.Router();

const controller = require("../controllers/analytics");

router.get(
  "/users-qty-dashboard",
  authenticate,
  controller.getUserQtyDashboard,
);

router.get(
  "/sales-qty-dashboard",
  authenticate,
  controller.getSalesQtyDashboard,
);

router.get(
  "/recent-sales-dashboard",
  authenticate,
  controller.getRecentSalesDashboard,
);

router.get(
  "/category-distributions",
  authenticate,
  controller.getCategoryDistributions,
);

router.get(
  "/category-performances",
  authenticate,
  controller.getCategoryPerformances,
);

router.get("/category-statuses", authenticate, controller.getCategoryStatuses);

router.get("/product-inventory", authenticate, controller.getProductInventory);

router.get(
  "/top-selling-products",
  authenticate,
  controller.getTopSellingProducts,
);

router.get("/product-ratings", authenticate, controller.getProductRatings);

router.get("/discount-impacts", authenticate, controller.getDiscountImpacts);

router.get("/sales-by-variants", authenticate, controller.getSalesByVariants);

router.get("/variant-stock", authenticate, controller.getVariantStock);

router.get(
  "/order-status-distribution",
  authenticate,
  controller.getOrderStatusDistribution,
);

router.get("/revenue-trends", authenticate, controller.getRevenueTrends);

router.get(
  "/payment-method-usage",
  authenticate,
  controller.getPaymentMethodUsage,
);

router.get("/peak-order-times", authenticate, controller.getPeakOrderTimes);

router.get("/sales-funnel", authenticate, controller.getSalesFunnel);

router.get("/seasonal-trends", authenticate, controller.getSeasonalTrends);

module.exports = router;
