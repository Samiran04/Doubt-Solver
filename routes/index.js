const express=require('express');
const router=express.Router();

const control=require('../controller/router_controller');

router.get('/',control.route);
router.use('/users',require('./users.js'));

console.log('Router is working');

module.exports=router;