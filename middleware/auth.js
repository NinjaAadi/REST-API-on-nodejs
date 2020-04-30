const jwt = require('jsonwebtoken');
const errorResponce = require('../utils/errorHandler');
const Users = require('../models/User');

exports.protect = async (req,res,next) => {
    let token;
    if(req.headers.authorization)
    {
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }
    if(!token){
         return next(new errorResponce('Not authorized to use this route',401));
    }
    try {
       //verify token
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
       req.user = await Users.findById(decoded.id);
       next();
    } catch (error) {
            next(new errorResponce("Not authorized to use this route", 401));
    }
}

//Grant action to permit specific roles

exports.authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
                return next(
                  new errorResponce("User role not authorized to access this route", 403)
                );
        }
        next();
    }
}   


