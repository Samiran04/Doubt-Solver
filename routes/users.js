const express=require('express');
const router=express.Router();
const pro=require('../controller/profile')
const user=require('../controller/user');

router.get('/profile',pro.profile);
router.use('/sign-in',user.sign_in);
router.use('/sign-up',user.sign_up);
router.post('/create',user.create);

module.exports=router;