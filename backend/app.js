import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import airplaneRoutes from './routes/airplaneRoutes.js';
import flightRoutes from './routes/flightRoutes.js';

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
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use('/api/airplane', airplaneRoutes);
app.use('/api/flight', flightRoutes);

//listen for express
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});