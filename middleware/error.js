const errorHandler = (err,req,res,next) => {
    res.status(err.statuscode).json({
        success:false,
        error:err.msg
    });
}
module.exports = errorHandler;