const express = require('express');
const { 
    getCourses, 
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
const advancedResults = require('../middlewares/advancedResults');
const Course = require('../models/Course');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(auth.protect, auth.authorize('publisher', 'admin'), createCourse);

    router
    .route('/:id')
    .get(getCourse)
    .put(auth.protect, auth.authorize('publisher', 'admin'), updateCourse)
    .delete(auth.protect, auth.authorize('publisher', 'admin'), deleteCourse);

module.exports = router;