const express = require('express');
const router = express.Router();

const reset_password_controller = require('../controllers/reset_password_controller');

router.get('/email-page', reset_password_controller.getPage);
router.get('/checkAccess/:access_token', reset_password_controller.checkAccess);
router.post('/check-mail', reset_password_controller.checkMail);
router.post('/changePassword/:access_token', reset_password_controller.changePassword);

module.exports = router;