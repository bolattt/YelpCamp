const express = require('express')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')

const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Review = require('./models/review')

const ExpressError = require('./utils/ExpressError')
const AppError = require('./AppError')

const {reviewSchema} = require('./schemas.js')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>console.log('database connected'))
.catch(err => console.log(err))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname,'public')))
app.use(flash())

const sessionConfig ={
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge : 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig))

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

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

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)


//404 
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})

// error handle 
app.use((err,req,res,next) => {
    console.log('this is err',err)
    const { statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render('error',{err})
    
})


app.listen(3000,()=>{
    console.log('server started')
})

