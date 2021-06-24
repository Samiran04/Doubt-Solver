const express = require("express");
const router = express.Router();

const chat_controller_api = require("../../../controllers/api/v1/chat");

router.get("/get-chat", chat_controller_api.getMessages);

module.exports = router;
