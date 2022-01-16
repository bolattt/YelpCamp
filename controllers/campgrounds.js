const Campground = require('../models/campground')

module.exports.index = async (req,res) => {
    const camps = await Campground.find()
    res.render('campground/index',{camps})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campground/new')
}

module.exports.createCampground = async (req,res,next) => {   
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id;
    await camp.save();
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${camp._id}`)  
}

module.exports.showCampground = async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    console.log(camp)
    if(!camp){
        req.flash('error','Cannot find that campground!')
      return   res.redirect('/campgrounds')
    }
    res.render('campground/show',{camp})
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit',{camp})
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id,{ ...req.body.campground })
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground =  async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id).then(data => console.log(data))
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')  
}