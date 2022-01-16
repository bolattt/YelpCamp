const express = require('express')
const router = express.Router({mergeParams:true});
const Review = require('../models/review')
const reviews = require('../controllers/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')


// reviews 
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

// delete reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;