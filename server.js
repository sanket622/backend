import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDDB connected"))
  .catch((error) => console.log(error));

app.get('/api/weather',async(req,res)=>{
    const {city} = req.query
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY
    const BASE_URL = 'https://openweathermap.org/api'

    if(!city) return res.status(400).json({error:'City name is required'})
    
        try{
            const [currentWeather,forecast] = await Promise.all([
                axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`),
                axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`),
            ])
            res.json({
                currentWeather:currentWeather.data,
                forecast:forecast.data.list.filter((_,index)=>index % 8 === 0),
            })
    }catch(error){
       res.status(500).json({error:'Error fetching weather data'})
    }
})

app.get('/check',(req,res)=>{
    res.json('Hi')
})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})