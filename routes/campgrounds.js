const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')

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
    const camp = await Campground.findById(id).populate('reviews').populate('author')
    if(!camp){
        req.flash('error','Cannot find that campground!')
      return   res.redirect('/campgrounds')
    }
    res.render('campground/show',{camp})
})


// post new route
router.post('/',isLoggedIn, validateCampground, catchAsync(async (req,res,next) => {   
        const camp = new Campground(req.body.campground)
        camp.author = req.user._id;
        await camp.save();
        req.flash('success','Successfully made a new campground!')
        res.redirect(`/campgrounds/${camp._id}`)  
}))


// delete route
router.delete('/:id',isLoggedIn,isAuthor, async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id).then(data => console.log(data))
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')
    
})

// update 
router.get('/:id/edit',isLoggedIn,isAuthor,async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit',{camp})
})

// PUT 
router.put('/:id',isLoggedIn,isAuthor,async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id,{ ...req.body.campground })
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router;
