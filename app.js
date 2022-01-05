const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const AppError = require('./AppError')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>console.log('database connected'))
.catch(err => console.log(err))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))

const verifyPassword = ((req,res,next) => {
    const {password} = req.query;
    console.log(password)
    if(password === 'chicken'){
        next();
    } 
    else{
        throw new AppError('password required',401)
        // res.send('you need a password')   
    } 
})

app.get('/secret',verifyPassword,(req,res) => {
    res.send('my secret is i"m a good developer')
})


// all camps 
app.get('/campgrounds',async (req,res) => {
    const camps = await Campground.find()
    console.log(camps)
    res.render('campground/index',{camps})
})

// get new route
app.get('/campgrounds/new',(req,res) => {
    res.render('campground/new')
})

// show route
app.get('/campgrounds/:id', async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    console.log(camp)
    res.render('campground/show',{camp})
})

// post new route
app.post('/campgrounds',async (req,res) => {
    console.log(req.body.campground)
    const camp = new Campground(req.body.campground)
    await camp.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete route
app.delete('/campgrounds/:id',async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id).then(data => console.log(data))
    res.redirect('/campgrounds')
    
})

// update 
app.get('/campgrounds/:id/edit',async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    res.render('campground/edit',{camp})
})

// PUT 
app.put('/campgrounds/:id',async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id,req.body)
    res.redirect(`/campgrounds/${id}`)
})


app.listen(3000,()=>{
    console.log('server started')
})