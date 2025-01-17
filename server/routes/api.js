const express = require("express");

const router = express.Router();

const controller = require("../controllers/api-controller");

router.post("/contact", controller.postSubmitMessage);

router.get("/categories", controller.getCategories);

router.get("/parent-categories", controller.getParentCategories);

router.get("/products", controller.getProducts);

router.get("/products/category/:id", controller.getCategoryProducts);

router.get("/products/best-selling", controller.getBestSellingProducts);

router.get("/product/:_id", controller.getProductById);

router.get("/products/related/:_id", controller.getRelatedProducts);

module.exports = router;
