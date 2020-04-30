const express = require('express');
const {protect} = require('../middleware/auth');
const {registerUser ,userLogin,getUserDetails,forgotPassword,resetPassword,updateUserDetails,updateUserPassword,logOut} = require('../controller/auth');

const router  = express.Router();

router.post('/register',registerUser);

router.get("/logout", logOut);

router.post('/login',userLogin);

router.get('/me',protect,getUserDetails);

router.post("/forgotpassword",forgotPassword);

router.put('/resetpassword/:resettoken',resetPassword);

router.put("/updatedetails", protect,updateUserDetails);

router.put("/updatepassword", protect, updateUserPassword);



module.exports = router;