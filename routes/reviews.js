const express = require('express');

const Router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

const {getReviews,getReview,createReview,updateReview,deleteReview} = require('../controller/reviews');

Router.get("/", getReviews).post("/", protect, authorize("user"), createReview);

Router.get("/:id", getReview)
  .put("/:id", protect, authorize("user", "admin"), updateReview)
  .delete("/:id", protect, authorize("user", "admin"), deleteReview);

module.exports = Router