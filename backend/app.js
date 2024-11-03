import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import airplaneRoutes from './routes/airplaneRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pilotRoutes from './routes/pilotRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './utils/errorHandler.js';
import Flight from './model/flight.js';
import Airport from './model/airport.js';

dotenv.config();
const PORT = process.env.PORT; 
//Express app
const app = express();

// Connect to mongodb
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

// middleware & static files
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use('/api/airplane', airplaneRoutes);
app.use('/api/flight', flightRoutes);
app.use('/api/pilot', pilotRoutes);
app.use('/api/airport', airportRoutes);
app.use('/', userRoutes);

app.get('/api/countries', async (req, res) => {
    try{
        const countries = await Airport.aggregate([
            {
                $group: {
                    _id: "$country",
                }
            },
            {
                $project: {
                    _id: 0,           
                    country: "$_id"   
                }
            }
        ]).sort({country: 1})
        res.status(200).json(countries);
    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
});

app.get('/api/cities/:country', async (req, res) => {
    try{
        const country = req.params.country;
        const airports = await Airport.find({country}).sort({ city: 1 })
        const cities = airports.map(airport => airport.city)
        res.status(200).json(cities);
    }catch(err){
        const errors = errorHandler(err);
        console.log(errors);
        res.status(400).json(errors);
    }
});

const __dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

//listen for express
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});