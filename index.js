const  { createApi } = require('unsplash-js')
const express = require('express');
const fetch = require('node-fetch')
require('dotenv').config();


//Config
const unsplash = createApi({
    accessKey: process.env.UNSPLASH_TOKEN,
    fetch:fetch
});

// global.fetch = fetch;

const app = express();

//Middlewares
app.use(express.json());

const processData = (json) => {
    const results = [];
    json.forEach(pic => {

        results.push(
            {
                id: pic.id,
                description: pic.description,
                ...pic.links
            }
        );
    });
    return results;
}

//Routes
app.get('/',(req,res)=>{
    res.json({"message":"Welcome to the api"})
})

app.get("/getImages",async (req,res)=>{
    const {options} = req.body;
    
    try{
        if(options==undefined || options=={}) throw new Error("Invalid Data")
        const photos = await unsplash.search.getPhotos({
            ...options
        });
        // console.log(photos.response.results)
        res.json(processData(photos.response.results));
    } catch (err) {
        console.log(err)
        res.send({error:err.message})
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server has started at port ${PORT}`);
})