const express = require("express");

const router = express.Router();

const controller = require("../controllers/chat");

router.get("/chat/:_id", controller.getChat);

router.post("/chat/create", controller.postCreateChat);

router.post("/chat/message", controller.postMessage);

module.exports = router;
