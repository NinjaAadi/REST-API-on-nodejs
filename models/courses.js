const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  tuition:{
    type:Number,
    required:[true,'Please add tuition fee']
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add miminum skill required"],
    enum:['beginner','intermediate','advanced']
  },
  scholarshipAvailable:{
      type:Boolean,
      default:false
  },
  createdAt:{
      type:Date,
      default:Date.now
  },
  bootcamp :{
    type:mongoose.Schema.ObjectId,
    ref:'Bootcamp',
    required:true
  }
});

courseSchema.statics.getAverageCost = async function(bootcampId){
  console.log('Calculating average cost');

  const obj = await this.aggregate([
    {
      $match:{bootcamp:bootcampId}
    },
    {
      $group:{
        _id:'$bootcamp',
        averageCost:{$avg:'$tuition'}
      }
    }
  ]);
  try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averagecost:Math.ceil(obj[0].averageCost/10)*10
      })
  } catch (error) {
    console.log(error)
  }
}
//Call average cost after save
courseSchema.post('save',function(){
    this.constructor.getAverageCost(this.bootcamp);
})
//Call average before remove
courseSchema.pre('remove',function(){
     this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course',courseSchema);