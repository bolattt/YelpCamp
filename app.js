if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport  = require('passport')
const LocalStrategy = require ('passport-local')
const User = require('./models/user')

const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Review = require('./models/review')

const ExpressError = require('./utils/ExpressError')
const AppError = require('./AppError')

const {reviewSchema} = require('./schemas.js')

const userRoutes = require('./routes/users') 
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const MongoDBStore = require('connect-mongo')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const secret = process.env.SECRET || 'thisshouldbeabettersecret!'
mongoose.connect(dbUrl)
.then(()=>console.log('database connected'))
.catch(err => console.log(err))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname,'public')))

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter:24*60*60
})

store.on("error",function(e){
    console.log('session store error',e)
})

const sessionConfig ={
    store,
    name:'session',
    secret,
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge : 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(flash())
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    console.log(req.session)
    res.locals.currentUser   =  req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/',(req,res) => {
    res.render('home')
})
//404 
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})

// error handle 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})

