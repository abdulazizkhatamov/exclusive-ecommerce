const express = require("express");

const router = express.Router();

const controller = require("../controllers/api-controller");

router.get("/categories", controller.getCategories);

router.get("/parent-categories", controller.getParentCategories);

router.get("/products", controller.getProducts);

router.get("/best-selling", controller.getBestSellingProducts);

router.get("/product/:_id", controller.getProductById);

module.exports = router;
