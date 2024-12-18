const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin");

const authenticate = require("../middlewares/admin-auth");

router.get("/", authenticate, controller.getAdmin);

router.get("/categories", authenticate, controller.getCategories);

router.post("/categories", authenticate, controller.postCreateCategory);

module.exports = router;
