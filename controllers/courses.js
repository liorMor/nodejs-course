const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        let bootcampCourses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: bootcampCourses.length,
            data: bootcampCourses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }

    const courses = await query;

    res.status(200).json(res.advancedResults);
});

// @desc    get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404);
    }
    

    res.status(200).json({ 
        sucess: true, 
        data: course
    });
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId} so course will not be created`), 404);
    }
    //make sure user is course owner
    else if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp.id}`, 401));
    }
    let course = req.body;
    course.bootcamp = bootcamp._id;
    course.user = req.user.id;
    course = await Course.create(course);

    res.status(201).json({ 
        sucess: true, 
        data: course
    });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404);
    }
    //make sure user is course owner
    else if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 401));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })
    res.status(200).json({ 
        sucess: true, 
        data: course
    });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    //make sure user is course owner
    else if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course`, 401));
    }
    await course.remove();
    res.status(200).json({ sucess: true, data: {} });
});
