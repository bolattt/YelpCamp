const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const {isLoggedIn} = require('../middleware')
const {campgroundSchema} = require('../schemas')

const validateCampground = (req,res,next) => {
    const {error} =campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}
// all camps 
router.get('/',catchAsync(async (req,res) => {
    const camps = await Campground.find()
    res.render('campground/index',{camps})
}))

// get new route
router.get('/new',isLoggedIn,(req,res) => {
    res.render('campground/new')
})

// show route
router.get('/:id', async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('reviews')
    if(!camp){
        req.flash('error','Cannot find that campground!')
      return   res.redirect('/campgrounds')
    }
    res.render('campground/show',{camp})
})

// post new route
router.post('/',isLoggedIn, validateCampground, catchAsync(async (req,res,next) => {   
        const camp = new Campground(req.body.campground)
        await camp.save();
        req.flash('success','Successfully made a new campground!')
        res.redirect(`/campgrounds/${camp._id}`)  
}))


// delete route
router.delete('/:id',isLoggedIn, async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id).then(data => console.log(data))
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')
    
})

// update 
router.get('/:id/edit',isLoggedIn,async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit',{camp})
})

// PUT 
router.put('/:id',isLoggedIn,async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id,{ ...req.body.campground })
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router;
