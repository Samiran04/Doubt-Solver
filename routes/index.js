const express=require('express');
const router=express.Router();

const control=require('../controller/router_controller');
const control2=require('../controller/user');

router.get('/',control.route);
router.use('/user',require('./users.js'));

console.log('Router is working');

module.exports=router;