import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Weather API Route
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const API_KEY = process.env.OPENWEATHER_API_KEY; // Make sure to add this in .env

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const [currentWeather, forecast] = await Promise.all([
            axios.get(`${BASE_URL}/weather`, { params: { q: city, appid: API_KEY, units: 'metric' } }),
            axios.get(`${BASE_URL}/forecast`, { params: { q: city, appid: API_KEY, units: 'metric' } }),
        ]);

        res.json({
            currentWeather: currentWeather.data,
            forecast: forecast.data.list ? forecast.data.list.filter((_, index) => index % 8 === 0) : [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// Health Check Route
app.get("/", (req, res) => {
    res.send("Welcome to Weather API");
  });

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;