const errorResponce = require("../utils/errorHandler");
const Bootcamp = require('../models/Bootcamp');
const path = require('path');

/*
@desc Get all bootcamps 
@routes GET /api/v1/bootcamps
@access public
*/
exports.getBootcamps = async (req,res,next) => {
  try {
    let query;
    //Copy req.query

    const reqQuery = {...req.query};

    //If there is a select option
    //Declare a var fields to take the select options to it
    let fields;
    if(req.query.select){
         fields = req.query.select.split(',').join(' ');
        console.log(fields);
    }
    else{
      fields = " ";
    }

    //For sorting

    let sortFields;
    if(req.query.sort){
      sortFields = req.query.sort.split(',').join(' ');
    }
    else{
      sortFields = ' ';
    }
    //For pagination
    let limit,page,skip;
    if(req.query.limit||req.query.page){
       limit = parseInt(req.query.limit,10);
       page = parseInt(req.query.page, 10);
       skip = (page-1)*limit
    }
    else{
      limit=100;
      page=1;
      skip=0;
    }
    const removeFields = ['select','sort','limit','page'];

    removeFields.forEach(element => {
        delete reqQuery[element];
    });

    //Create a query string

    let queryStr = JSON.stringify(reqQuery);

    //Put a dollar sign to be able to use greater than or less than

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/,match => {
      return `$${match}`
    })
  
    //Finding resources

    query = Bootcamp.find(JSON.parse(queryStr)).select(fields).sort(sortFields).skip(skip).limit(limit).populate('courses');
    const bootcamps = await query;
    res.status(200).json({
      success:true,
      count:bootcamps.length,
      data:bootcamps
    })
  } catch (error) { 
      console.log(error);
  }
}

/*
@desc Get bootcamps by id
@routes GET /api/v1/bootcamps/:id
@access public
*/
exports.getBootcampsById = async (req,res,next) => {
    try {
      const bootcamp =  await Bootcamp.findById(req.params.id);
      res.status(200).json({
        success:true,
        data:bootcamp
      })
    } catch (error) {

        next(new errorResponce(`Bootcamp not found with id of ${req.params.id}`,404));
    }
}

/*
@desc Post bootcamp
@routes POST /api/v1/bootcamps/
@access public
*/
exports.setBootcamp = async (req,res,next) => {
  try {

      req.body.user = req.user.id;

      //Check for published bootcamps
      const publicBootcamp = await Bootcamp.findOne({
        user:req.user.id
      })
      console.log(req.body);
        //If the user is not admin they can publish one bootcamp only
      if(req.user.role!='admin'&& publicBootcamp){
        return next(new errorResponce('The user has already published a bootcamp',401))
      }
      const bootcamp = await Bootcamp.create(req.body);

      res.status(200).json({
        success: true,
        data: bootcamp
      });
  } catch (error) {
    console.log(error);
      res.status(400).json({
        success:false,
        
      })
  }
 
}

/*
@desc update bootcamps by id
@routes PUT/ api/v1/bootcamps/:id
@private
*/
exports.updateBootcamp = async (req,res,next) => {
      try {
            const bootcamp = await Bootcamp.findByIdAndUpdate(
              req.params.id,
              req.body,
              {
                new: true,
                runValidators: true
              }
            );
            if (!bootcamp) {
              return res.status(400).json({
                status: false
              });
            }
            // Make sure that the user is the bootcamp owner
            if (
              bootcamp.user.toString() != req.user.id &&
              req.user.role != "admin"
            ) {
              return next(
                new errorResponce(
                  "User is not authorized to update this bootcamp",
                  401
                )
              );
            }
            res.status(200).json({
              status: true,
              data: bootcamp
            });
          }
         catch (error) {
       
     }
}

/*
@desc Delete bootcamps by id
@routes DELETE/ api/v1/bootcamps/:id
*/
exports.deleteBootcamp = async (req,res,next) => {
  try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
          return next(new errorResponce("No bootcamp found", 404));
        }
        // Make sure that the user is the bootcamp owner
        if (
          bootcamp.user.toString() != req.user.id &&
          req.user.role != "admin"
        ) {
          return next(
            new errorResponce(
              "User is not authorized to update this bootcamp",
              401
            )
          );
        }
        bootcamp.remove();
        res.status(200).json({
          success: true
        });
      } catch (error) {
    
  }
 
}

/*
@desc Upload a photo
@routes PUT/ api/v1/bootcamps/:id/photo
*/
exports.uploadPhoto = async (req,res,next) => {
  try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
          return next(
            new errorResponce("Bootcamp with given id not found", 404)
          );
        }

        // Make sure that the user is the bootcamp owner
        if (
          bootcamp.user.toString() != req.user.id &&
          req.user.role != "admin"
        ) {
          return next(
            new errorResponce(
              "User is not authorized to update this bootcamp",
              401
            )
          );
        }
        if (!req.files) {
          return next(new errorResponce("No files uploaded", 400));
        }
        const file = req.files.file;

        //Make sure that the image is a photo

        if (!file.mimetype.startsWith("image")) {
          return next(new errorResponce("Please upload a image file", 400));
        }

        //Check the image size

        if (file.size > process.env.MAX_FILE_SIZE) {
          return next(
            new errorResponce(
              "Please upload a image file smaller than 1mb",
              400
            )
          );
        }

        //Create custom file name

        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
          if (err) {
            console.log(err);
            return next(new errorResponce("Problem with a file upload", 500));
          }
          const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
          });
          res.status(200).json({
            success: true,
            data: bootcamp
          });
        });
      } catch (error) {
      console.log(error);
  }

}


