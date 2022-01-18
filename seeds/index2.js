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
        params:{query:'landscape',per_page:1}}
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

    for ( let i=0; i<200; i++){

        // const img = data[i].src.medium;
        // const desc =  data[i].alt; 
        const price = Math.floor(Math.random()*30)
        const random1000 = Math.floor(Math.random()*1000);

        
        const camp = new Campground({
            author:'61e202c75378c03aec2e32c2',
            title:`${descriptors[randomNum(descriptors)]} ${places[randomNum(places)]}`,
            location:`${cities[randomNum(cities)].city}, ${cities[randomNum(cities)].state}`,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            // image:img,
            images:[  {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
            },
            {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
            }],
            price,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        })
    
        camp.save()
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }   
}

saveCamp();





