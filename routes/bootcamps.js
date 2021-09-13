const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')
const advancedResults = require('../middlewares/advancedResults');
const Bootcamp = require('../models/Bootcamp');
const { protect, authorize } = require('../middlewares/auth');

//include other resource routers
const courseRouter = require('./courses');
const reviewsRouter = require('./reviews');

const router = express.Router();
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewsRouter);
//re-route to other resources

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)
router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);


module.exports = router;