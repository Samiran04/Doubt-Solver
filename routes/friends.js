const express = require('express');
const router = express.Router();

const friends_controller = require('../controllers/friends_controllers');

router.get('/send-request', friends_controller.sendRequest);
router.get('/friend-action', friends_controller.friendsAction);

module.exports = router;