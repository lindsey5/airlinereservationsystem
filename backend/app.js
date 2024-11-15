import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import airplaneRoutes from './routes/airplaneRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pilotRoutes from './routes/pilotRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();
const PORT = process.env.PORT; 
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
app.use(cookieParser());

app.use('/api', apiRoutes);
app.use('/api/airplane', airplaneRoutes);
app.use('/api/flight', flightRoutes);
app.use('/api/pilot', pilotRoutes);
app.use('/api/airport', airportRoutes);
app.use('/api/user', userRoutes);  
app.use('/api/booking', bookingRoutes)

app.get('/logout', (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, secure: false });
    res.redirect('/');
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
