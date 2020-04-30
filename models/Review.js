const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength:100
  },
  text: {
    type: String,
    required: [true, "Please add a description"]
  },
  rating:{
    type:Number,
    required:[true,'Please add a rating'],
    max:10,
    min:1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
    user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true
  }
});

//Prevent the user from giving more thn one review

reviewSchema.index({
  bootcamp:1,
  user:1
},{
  unique:true
})


//Calculate the average ratings
reviewSchema.statics.getAverageRating = async function(bootcampId) {
  console.log("Calculating average rating");

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (error) {
    console.log(error);
  }
};
//Call average cost after save
reviewSchema.post("save", function() {
  this.constructor.getAverageRating(this.bootcamp);
});
//Call average before remove
reviewSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.bootcamp);
});
module.exports = mongoose.model("Review", reviewSchema);
