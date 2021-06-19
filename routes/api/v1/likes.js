const express = require("express");
const router = express.Router();

const likes_controller = require("../../../controllers/api/v1/likes_api");

router.get("/action-like", likes_controller.createLike);

module.exports = router;
