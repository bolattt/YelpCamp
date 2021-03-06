const campground = require('../models/campground')
const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

module.exports.index = async (req,res) => {
    const camps = await Campground.find()
    console.log(camps)
    res.render('campground/index',{camps})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campground/new')
}

module.exports.createCampground = async (req,res,next) => {   
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const camp = new Campground(req.body.campground)
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp)
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
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id,{ ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename : f.filename }))
    camp.images.push(...imgs)
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
       await  camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground =  async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id).then(data => console.log(data))
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')  
}

