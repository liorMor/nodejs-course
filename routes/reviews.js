const express = require('express');
const { 
    getReviews,
    getReview,
    addReview,
    deleteReview,
    updateReview
} = require('../controllers/reviews')
const advancedResults = require('../middlewares/advancedResults');
const Review = require('../models/Review');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(auth.protect, auth.authorize('user', 'admin'), addReview);

router
    .route('/:id')
    .get(getReview)
    .delete(auth.protect, auth.authorize('user', 'admin'), deleteReview)
    .put(auth.protect, auth.authorize('user', 'admin'), updateReview);

module.exports = router;
