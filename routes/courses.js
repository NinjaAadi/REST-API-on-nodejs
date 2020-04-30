const express = require('express');
const { getCourses,getSingleCourses,addCourse,updateCourses,deleteCourses} = require('../controller/courses');
const router = express.Router({mergeParams:true});

const { protect,authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getSingleCourses)
  .put(protect, authorize("publisher", "admin"), updateCourses)
  .delete(protect, deleteCourses);

module.exports = router;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYTRlM2I1ODA1YjUyNDU5OGRhYmMxNSIsImlhdCI6MTU4NzkzMDE3MiwiZXhwIjoxNTkwNTIyMTcyfQ.nTDt6q9N4_BDMHB3MV-69YSvj7DKUUrVGMGfGbBrYRw