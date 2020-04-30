const errorResponce = require("../utils/errorHandler");
const Bootcamp = require("../models/Bootcamp");
const Users = require("../models/User");
const sendemail = require('../utils/sendmail');
const crypto = require('crypto');
// @desc Register a user
// @routes POST api/v1/auth/register
//  @access public
exports.registerUser = async (req, res, next) => {
try {
    
     const { name, email, password, role } = req.body;

     const user = await Users.create({
       name,
       email,
       password,
       role
     });

   sendResCookie(200, user, res);

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};
// @desc Login user
// @route POST api/v1/auth/login
// @access public

exports.userLogin = async (req,res,next) => {
    const {email,password} = req.body;
    
    //Check if there is no email or password

    if(!email || !password){
        return next(
          new errorResponce("Please provide and email and password", 400)
        );
    }

    //Check for the user
    const user  =  await Users.findOne({email:email}).select('+password'); //In the model we have made the password as select false

    if(!user){
        return next(new errorResponce("Invalid credentails", 401));
    }

    //Check if the password exists
    const checkpass = await user.checkPassword(password);
    if(!checkpass){
         return next(new errorResponce("Invalid credentails", 401));
    }
    console.log(req.cookie);
    sendResCookie(200 , user , res);
}

// @desc Forgot password
// @route POST api/v1/auth/me
// @access public
exports.getUserDetails = async (req,res,next) => {
    try {
        const userid = req.user.id;
        const user = await Users.findById(userid);
        res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        next(new errorResponce('User not found',404));
    }
}

// @desc Forgot password
// @route POST api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = async (req,res,next) => {
   
    try {
         const user = await Users.findOne({ email: req.body.email });
         if (!user) {
           return new errorResponce("Email does not exists", 404);
         }

         //Get the token

         const resetToken = await user.getResetPasswordToken();
         await user.save({
             validateBeforeSave:false
         });
        
         //We are sending whole url to change the password
         const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

         //Messege that we are sending
         const messege = `You have recieved this mail because you (or someone else) have requested to change the password. Please click on the link given below ${resetUrl}`;

         //Call the send email func
         try {
             await sendemail({
                 email:user.email,
                 subject:'Password reset token',
                 messege:messege

             })
         } catch (error) {
             console.log(error);
         }
         res.status(200).json({
             success:true,
             data:'The mail was sent'
         })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire  = undefined;

        console.log(error);
        next(new errorResponce('Email could not be sent',500));
    }
}

// @desc Reset password
// @route PUT api/v1/auth/resetpassword/:resetToken
// @access public
exports.resetPassword = async (req,res,next) => {
    try {
       const getHashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

       const reqUser = await Users.findOne({
                    resetPasswordToken:getHashedToken,
                    resetPasswordExpire:{$gt : Date.now()}
                    });
        if(!reqUser){
            return  next(new errorResponce('Url expired',404))
        }
        reqUser.password = req.body.password;
          reqUser.resetPasswordToken = undefined;
          reqUser.resetPasswordExpire = undefined;
          console.log(reqUser);
          reqUser.save();
          res.status(200).json({
              success:true,
              data:reqUser
          })

       
    } catch (error) {
        console.log(error);
        next(new errorResponce(error,404));
    }
}

// @desc Update user details
// @route PuT api/v1/auth/updatedetails
// @access private
exports.updateUserDetails = async (req,res,next) => {
    try {
      
        const fields =  {
            name:req.body.name,
            email:req.body.email
        }
        console.log(fields);
        const usr = await Users.findByIdAndUpdate(req.user.id,fields,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:usr
        })
    } catch (error) {
        next(new errorResponce('User not found',404));
    }
}


// @desc Update user passworr
// @route PUT api/v1/auth/updatepassword
// @access private
exports.updateUserPassword = async (req,res,next) => {
    try {
      
    const user = await Users.findById(req.user.id).select('+password');

    //Check if the user's given current password is equal to the actual passwprd
    if(!(await user.checkPassword(req.body.currentpassword))){
            return next(new errorResponce('Incorrect password'),402);
    }

    user.password = req.body.newpassword
    await user.save();

    sendResCookie(200 , user , res);

    } catch (error) {
        next(new errorResponce('error',404));
    }
}

// @desc logout
// @route PUT api/v1/auth/logout
// @access private
exports.logOut = async (req,res,next) => {
    try {
        res.cookie("token", "none", {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly:true
        });
        res.status(200).json({
            success:true
        })

    } catch (error) {
        next(new errorResponce('error',404));
    }
}
//Function to send a cookie {it is a helper function}

const sendResCookie = (statuscode,user,res) => {

     //Get the token from the function
     const token = user.getSignedWebToken();

     const options  = {
         expires:new Date(Date.now + 30*24*60*60*1000),
         httpOnly:true
     }
     res
     .status(statuscode)
     .cookie('token',token,options)
     .json({
         success:true,
         token:token
     })
}
