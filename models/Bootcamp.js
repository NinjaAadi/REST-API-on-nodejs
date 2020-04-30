const mongoose  = require('mongoose');

//Schema that takes in all the fields that take the schema

const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more tha 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"]
  },
  website: {
    type: String,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      "Please add a valid URl"
    ],
    required: true
  },
  phone: {
    type: String,
    required: true,
    maxlength: [20, "Phone numbers cannot be more than 20 characters"]
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      'Please add a valid email address'
    ]
  },
  address:{
    type:String,
    required:[true,'Please add an address']
  },
  // location:{
  //     type:{
  //         type:String,
  //         enum:['Point'],
  //         required:true,
  //         index:'2dsphere'
  //     },
  //     coordinates:{
  //         type:[Number],
  //         required:true
  //     },
  //     formattedAddress:String,
  //     street:String,
  //     city:String,
  //     state:String,
  //     zipcode:String,
  //     country:String
  // },
  careers:{
      type:[String],
      required:true,
      enum:['Web Development','Mobile Development','UI/UX','Data Science','Buisness','Other']
  },
  averageRating:{
      type:Number,
      min:[1,'Rating must be atleast 1'],
      max:[10,'Rating cannot be more than 10']
  },
  averagecost:Number,
  photo:{
      type:String,
      default:'no-photo.jpg'
  },
  housing:{
      type:Boolean,
      default:false
  },
  jobAssistance:{
      type:Boolean,
      default:false
  },
   jobGuarantee:{
      type:Boolean,
      default:false
  },
   acceptGi:{
      type:Boolean,
      default:false
  },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:'users',
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }


},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

//Cascade delete courses when a bootcamp is deleted

bootcampSchema.pre('remove',async function(next) {
  console.log('Courses being deleted');
    await this.model('Course').deleteMany({bootcamp:this._id});
    next();

})
//Reverse populate with virtuals
 bootcampSchema.virtual('courses',{
   ref:'Course',
   localField:'_id',
   foreignField:'bootcamp',
   justOne:false

 })

module.exports = mongoose.model('Bootcamp',bootcampSchema);