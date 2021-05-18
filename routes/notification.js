const express = require('express');
const passport = require('passport');
const router = express.Router();

const notification_controller = require('../controllers/notification_controller');

router.get('/open', passport.checkAuthentication, notification_controller.open);

module.exports = router;