const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");

const authenticate = require("../middlewares/auth");

// POST - Create account.
router.get("/", authenticate, controller.getUser);

module.exports = router;
