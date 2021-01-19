const express=require('express');
const router=express.Router();
const control=require('../controller/router_controller');

router.get('/',control.route);

console.log(`Router is working`);

module.exports=router;