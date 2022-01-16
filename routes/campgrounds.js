const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

// all camps 
router.get('/',catchAsync(campgrounds.index))

// get new route
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

// show route
router.get('/:id', catchAsync(campgrounds.showCampground))

// post new route
router.post('/',isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// get edit form 
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

// PUT 
router.put('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.updateCampground))

// delete route
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports = router;
