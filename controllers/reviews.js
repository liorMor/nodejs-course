const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        let bootcampReviews = await Review.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: bootcampReviews.length,
            data: bootcampReviews
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!review) {
        return next(new ErrorResponse(`No review with id of ${req.params.id}`), 404);
    }
    
    res.status(200).json({ 
        sucess: true, 
        data: review
    });
});

// @desc    Add review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    console.log(req.params.bootcampId);
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId} so review will not be created`, 404));
    }
    let review = req.body;
    review.bootcamp = bootcamp._id;
    review.user = req.user.id;
    review = await Review.create(review);

    res.status(201).json({ 
        sucess: true, 
        data: review
    });
});

// @desc    Update revieq
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`No review with id of ${req.params.id}`), 404);
    }
    //make sure user is review owner
    else if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })
    res.status(200).json({ 
        sucess: true, 
        data: review
    });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    //make sure user is review owner
    else if (review.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401));
    }
    await review.remove();
    res.status(200).json({ sucess: true, data: {} });
});


