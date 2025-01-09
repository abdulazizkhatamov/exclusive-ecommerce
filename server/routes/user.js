const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");

const authenticate = require("../middlewares/user-auth");

// POST - Create account.
router.get("/", authenticate, controller.getUser);

router.post("/cart", authenticate, controller.postAddToCart);

router.put("/cart/qty", authenticate, controller.putUpdateCartItemQty);

router.delete("/cart/:_id", authenticate, controller.deleteDeleteCartItem);

router.post("/address", authenticate, controller.postCreateAddress);

router.delete("/address/:_id", authenticate, controller.deleteDeleteAddress);

router.get("/order/:_id", authenticate, controller.getOrdersByUserID);

router.post("/order", authenticate, controller.postCreateOrder);

module.exports = router;
