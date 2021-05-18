const express=require('express');
const router=express.Router();
const passport = require('passport');

const homeController=require('../controllers/home_controller');

router.get('/', passport.checkAuthentication, homeController.home);

router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/friends', require('./friends'));
router.use('/likes', require('./likes'));
router.use('/password', require('./reset-password'));
router.use('/notification', require('./notification'));

router.use('/api', require('./api'));

module.exports=router;