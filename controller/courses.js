const errorResponce = require("../utils/errorHandler");
const Courses = require("../models/courses");
const Bootcamp = require("../models/Bootcamp");

// @desc : Get courses 
// @routes GET/api/v1/courses
// @routes GET/api/v1/bootcampId/courses
// @access public

exports.getCourses = async (req,res,next) => {
    try {
    let query;

             if(req.params.bootcampId){
                  query = Courses.find({bootcamp: req.params.bootcampId})
                 }
             else{
                query = Courses.find().populate({
                    path:'bootcamp',
                    select:'name description'
                });
                }
            console.log(req.params.bootcampId);
            const courses = await query;
            res.status(200).json({
                success:true,
                length:courses.length,
                data:courses,
            })

    } catch (error) {
        next(new errorResponce(404, 'Course not found'));
    }
}


// @desc : Get a single course
// @routes GET/api/v1/courses/:id
// @access public

exports.getSingleCourses = async (req,res,next) => {
    try {
        const course = await Courses.findById(req.params.id).populate({
            path:'bootcamp',
            select : 'name description'
        });
        res.status(200).json({
            success:true,
            data:course
        })
    } catch (error) {
        next(404,error);
    }
}

// @desc : Add a course
// @routes POST/api/v1/:bootcampId/courses
// @access private

exports.addCourse = async (req,res,next) => {
    try { 
        req.body.bootcamp = req.params.bootcampId;
        console.log(req.body);
        const bootcamp = Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return new errorResponce(404,'No bootcamp id found');
        }
       const course = await  Courses.create(req.body);

       res.status(200).json({
           success:true,
           data:course
       })
        
    } catch (error) {
        console.log(error)
    }
}
// @desc : Update a course
// @routes POST/api/v1/courses/:id
// @access private

exports.updateCourses = async (req,res,next) => {
    try {
        let courses = await Courses.findById(req.params.id);
        if(!courses){
            return new errorResponce(404,'No courses with given id is found');
        }
         courses = await Courses.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:courses
        })
    } catch (error) {
        console.log(error);
    }
}
// @desc : Delete a course
// @routes DELETE/api/v1/courses/:id
// @access private

exports.deleteCourses = async (req,res,next) => {
    
 try {
   let courses = await Courses.findById(req.params.id);
   if (!courses) {
     return new errorResponce(404, "No courses with given id is found");
   }
    await courses.remove();
   res.status(200).json({
     success: true,
   });
 } catch (error) {
   console.log(error);
 }
}


