const express = require("express");
const router = express.Router();

const controller = require("../controllers/user-auth");

// POST - Create account.
router.post("/create-account", controller.postCreateAccount);

// POST - Login account.
router.post("/login-account", controller.postLoginAccount);

// POST - Refresh token.
router.get("/refresh-token", controller.getRefreshAccessToken);

router.post("/logout-account", controller.postLogoutAccount);

module.exports = router;
