const express = require("express");
const router = express.Router();

const likes_controller = require("../controllers/likes_controller");

router.get("/like-action", likes_controller.likesAction);

module.exports = router;
