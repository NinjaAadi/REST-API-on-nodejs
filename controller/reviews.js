const errorResponce = require("../utils/errorHandler");
const Courses = require("../models/courses");
const Bootcamp = require("../models/Bootcamp");
const Review = require('../models/Review');




//@desc Get all reviews for a bootcamp
//@route GET api/v1/bootcamps/:bootcampid/reviews
//Access publis

exports.getReviews = async (req,res,next) => {
    let review;
    if(req.params.bootcampId){
           review = await Review.find({bootcamp:req.params.bootcampId});
    }
    else{
            review = await Review.find();
    }
    
    console.log(req.params.bootcampId);

    //Check if any review exists or not

    if(!review){
        next(new errorResponce('There is no reviews available for this bootcamp',404));
    }

    res.status(200).json({
        success:true,
        data:review
    })
}   


//@desc Get a single review
//@route GET api/v1/review/:id
//Access publis

exports.getReview = async (req,res,next) => {
  try {
           const review = await Review.findById(req.params.id).populate({
             path: "bootcamp",
             select: "name text"
           });

           //Check if any review exists or not

           if (!review) {
             return next(new errorResponce("There is no reviews", 404));
           }

           res.status(200).json({
             success: true,
             data: review
           });
  } catch (error) {
        next(new errorResponce(error, 404));
  }
}


//@desc Add a review
//@route POST api/v1/bootcamps/:bootcampid/reviews
//Access private/user

exports.createReview = async (req,res,next) => {
  try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        //Make sure the bootcamp exists

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if(!bootcamp){
            return next(new errorResponce('Bootcamp does not exists'),404);
        }

        //Create the review
        const review = await Review.create(req.body);

        res.status(201).json({
            success:true,
            data:review
        })
  } catch (error) {
      console.log(error);
      console.log(req.body.bootcamp);
        next(new errorResponce(error, 404));
  }
}


//@desc Update a review
//@route PUT api/v1/reviews/:id
//Access private/user

exports.updateReview = async (req,res,next) => {
  try {
      let review = await Review.findById(req.params.id);

      //Check if the review exists or not
      if(!review){
          return next(
            new errorResponce("There is no review to be modifies", 404)
          );
      }
      if(req.user.id!==review.user.toString()&&req.user.role!='admin'){
             return next(
               new errorResponce("Not authorized to edit this review", 401)
             );
      }
      review = await Review.findByIdAndUpdate(req.params.id,req.body,{
          new :true,
          runValidators:true
      })

        res.status(201).json({
            success:true,
            data:review
        })
  } catch (error) {
      console.log(error);
      console.log(req.body.bootcamp);
        next(new errorResponce(error, 404));
  }
}


//@desc delete a review
//@route DELETE api/v1/reviews/:id
//Access private/user

exports.deleteReview = async (req,res,next) => {
  try {
      let review = await Review.findById(req.params.id);

      //Check if the review exists or not
      if(!review){
          return next(
            new errorResponce("There is no review to be modifies", 404)
          );
      }
      if(req.user.id!==review.user.toString()&&req.user.role!='admin'){
             return next(
               new errorResponce("Not authorized to edit this review", 401)
             );
      }
      review = await Review.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success:true
        })
  } catch (error) {
      console.log(error);
      console.log(req.body.bootcamp);
        next(new errorResponce(error, 404));
  }
}