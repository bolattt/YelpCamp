const {descriptors,places } = require('./seedHelpers.js')
const cities = require('./cities.js')
const  Campground  = require('../models/campground.js')

// pexels 
const pexelsKey = '563492ad6f91700001000001ef0062c7143d4f34bcff0e79d8e8c407'

// mongoose 
const mongoose = require('mongoose');
const { default: axios } = require('axios');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>console.log('database connected'))
.catch(err => console.log(err))

// get randomNumber
const randomNum = (array) => {
    const rand = Math.floor(Math.random()*array.length)
    return rand;
}


const getPhoto = async () => {
    const url = 'https://api.pexels.com/v1/search'
    const config = {
        headers:{Authorization:pexelsKey},
        params:{query:'landscape',per_page:5}}
    try{
        const data = await axios.get(`${url}`,config);
        return data.data.photos;
    } catch(e){
        console.log(e)
    }
}

const saveCamp = async() => {
    await Campground.deleteMany({});
    const data = await getPhoto();

    for ( let i=0; i<5; i++){

        const img = data[i].src.medium;
        const desc =  data[i].alt; 

        console.log(img)
        
        const camp = new Campground({
            author:'61e202c75378c03aec2e32c2',
            title:`${descriptors[randomNum(descriptors)]} ${places[randomNum(places)]}`,
            location:`${cities[randomNum(cities)].city}, ${cities[randomNum(cities)].state}`,
            image:img,
            description:desc
        })
    
        camp.save()
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }   
}

saveCamp();





