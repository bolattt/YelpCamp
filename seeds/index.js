const {descriptors,places } = require('./seedHelpers.js')
const cities = require('./cities.js')
const  Campground  = require('../models/campground.js')
const unsplashKey = 'ic6_fTcfYbIF1De_IVFQwkyUke2iYGuVpiRiDxsXJu8'


const mongoose = require('mongoose');
const { default: axios } = require('axios');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>console.log('database connected'))
.catch(err => console.log(err))

const randomNum = (array) => {
    const rand = Math.floor(Math.random()*array.length)
    return rand;
}

const getPhoto = async () => {
    const url = 'https://api.unsplash.com/photos/random/?client_id='
    const config = {params:{collections:11649432,count:1 }}
    try{
        const data = await axios.get(`${url}${unsplashKey}`,config);
        console.log(data)
        return data.data
    } catch(e){
        console.log(e)
    }
}

getPhoto();
const saveCamp = async() => {
  
    for ( let i=0; i<2; i++){
        const price = Math.floor(Math.random()*30)
        // Campground.deleteMany({});
        const data = await getPhoto();
        const img =  data[0].urls.small;
        const desc = data[0].alt_description;
        const camp = new Campground({
            title:`${descriptors[randomNum(descriptors)]} ${places[randomNum(places)]}`,
            location:`${cities[randomNum(cities)].city}, ${cities[randomNum(cities)].state}`,
            image:img,
            description:desc,
            price
        })
    
        camp.save()
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }   
}

saveCamp();



