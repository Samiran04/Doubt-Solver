const express = require("express");
const router = express.Router();

const comments_controller_api = require("../../../controllers/api/v1/comments");

router.post("/create-comment", comments_controller_api.createComment);

module.exports = router;
