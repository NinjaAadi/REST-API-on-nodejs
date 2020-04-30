const errorResponce = require("../utils/errorHandler");
const Bootcamp = require("../models/Bootcamp");
const Users = require("../models/User");
const sendemail = require("../utils/sendmail");


// @desc get all the users
// @routes GET api/v1/auth/getallusers
//  @access private/admin
exports.getUser = async (req, res, next) => {
try {
    
    const users = await Users.find();
    if(!users){
        return next(new errorResponce('No users found', 400));
    }
    res.status(200).json({
        success:true,
        length:users.length,
        data:users
    })

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};

// @desc get a single user
// @routes GET api/v1/auth/getuser/:id
//  @access private/admin
exports.getSingleUser = async (req, res, next) => {
try {
    
    const users = await Users.findById(req.params.id);
    if(!users){
        return next(new errorResponce('No users found with this id', 400));
    }
    res.status(200).json({
        success:true,
        length:users.length,
        data:users
    })

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};

// @desc Create a user
// @routes GET api/v1/auth/createuser
//  @access private/admin
exports.createUser = async (req, res, next) => {
try {
    
    const user = await Users.create(req.body);
    if(!user){
        return next(new errorResponce('No users found with this id', 400));
    }
    res.status(201).json({
        success:true,
        data:user
    })

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};

// @desc Update a user
// @routes GET api/v1/auth/updateuser/:id
//  @access private
exports.updateUser = async (req, res, next) => {
try {
    
    const user = await Users.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    });
    res.status(200).json({
        success:true,
        data:user
    })

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};

// @desc delete  a user
// @routes GET api/v1/auth/updateuser/:id
//  @access private
exports.deleteUser = async (req, res, next) => {
try {
    
    const user = await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
    })

} catch (error) {
    next(new errorResponce(error.message,400));
}
   
};