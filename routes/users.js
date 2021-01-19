const express=require('express');
const router=express.Router();
const pro=require('../controller/profile')

router.get('/profile',pro.profile);

module.exports=router;