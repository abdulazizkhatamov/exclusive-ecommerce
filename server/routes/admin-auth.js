const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin-auth");

router.post("/create-account", controller.postCreateAccount);

router.post("/login-account", controller.postLoginAccount);

router.get("/refresh-token", controller.getRefreshAccessToken);

router.post("/logout-account", controller.postLogoutAccount);

router.get("/is-exist", controller.getAdminExistence);

module.exports = router;
