const express = require("express");
const router = express.Router();

const friends_controller_api = require("../../../controllers/api/v1/friendship");

router.get("/add-friend", friends_controller_api.addFriend);
router.get("/remove-friend", friends_controller_api.removeFriend);
router.get("/get-friends", friends_controller_api.getFriend);

module.exports = router;
