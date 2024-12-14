const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth");

// POST - Create account.
router.post("/create-account", controller.postCreateAccount);

// POST - Login account.
router.post("/login-account", controller.postLoginAccount);

// POST - Refresh token.
router.get("/refresh-accessToken", controller.getRefreshAccessToken);

router.get("/logout-account", controller.getLogoutAccount);

module.exports = router;
