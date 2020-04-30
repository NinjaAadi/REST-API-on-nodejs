const express = require('express');
const router  = express.Router();
const {protect,authorize} = require('../middleware/auth');
//This file is the router file to route to different fumctions

const {
    getBootcamps,
    getBootcampsById,
    setBootcamp,
    updateBootcamp,
    deleteBootcamp,
    uploadPhoto
    } = require('../controller/bootcamp');


//Include other resources
  const courseRouter = require('./courses');
  const reviewRouter = require('./reviews');
  router.use('/:bootcampId/courses',courseRouter);
  router.use("/:bootcampId/reviews", reviewRouter);

/*We can use router.get('/',(req,res) = > {

})*/

//We want to make controller method clean
router.route('/')
    .get(getBootcamps)
    .post(protect,authorize('publisher','admin'),setBootcamp);

router
  .route("/:id")
  .get(getBootcampsById)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize('publisher','admin'),deleteBootcamp);

router.route("/:id/photo").put(protect,uploadPhoto);


module.exports = router;