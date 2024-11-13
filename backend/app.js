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
import Airport from './model/airport.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from './model/user.js';

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

app.use('/api/airplane', airplaneRoutes);
app.use('/api/flight', flightRoutes);
app.use('/api/pilot', pilotRoutes);
app.use('/api/airport', airportRoutes);
app.use('/api/user', userRoutes);  

app.get('/logout', (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, secure: false });
    res.redirect('/');
});

app.post('/api/verify-code', async (req, res) => {
    try {
        // Verify the JWT and decode its payload
        const code = req.cookies.verificationCode;

        if(!code){
            throw new Error('The code has expired. Please request a new one')
        }

        const decoded = jwt.verify(code , process.env.JWT_SECRET);

        const storedCode = decoded.code;   
        if (storedCode == req.query.code) {
            res.clearCookie('verificationCode');
            return res.status(200).json({ message: 'Verification successful. Your email has been verified!' });
        }
        throw new Error('Invalid code. Please check and try again.');
    } catch (err) {
        const errors = errorHandler(err);
        return res.status(400).json({ errors });
    }
});


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
    try {
        const country = req.params.country;
        
        // Fetch airports for the specified country
        const airports = await Airport.find({ country }).sort({ city: 1 });

        // Create a Set to store unique city names
        const uniqueCities = new Set(airports.map(airport => airport.city));

        // Convert the Set back to an array
        const cities = Array.from(uniqueCities);

        // Respond with the array of unique cities
        res.status(200).json(cities);
    } catch (err) {
        const errors = errorHandler(err);
        console.log(errors);
        res.status(400).json(errors);
    }
});

const url = process.env.NODE_ENV === 'production' ? 'https://airlinereservationsystem.onrender.com' : 'http://localhost:5173';
app.post('/api/payment-link',async (req, res) => {
    try{
        const line_items = [];
        console.log(req.body.bookings)
        req.body.bookings.flights.forEach(flight => {
            flight.passengers.forEach(passenger=> {
                const item = {
                    currency: 'PHP',
                    amount: passenger.price * 100, 
                    name: `${flight.destination} (${passenger.type}) `, 
                    quantity: 1
                }
                const isExist = line_items.find(line_item => line_item.name === item.name)

                if(isExist){
                    isExist.quantity += 1;
                }else{
                    line_items.push(item)
                }
            })
        })

        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              authorization: 'Basic c2tfdGVzdF9EYllaMVRHYTlFcGFBZzVwVmdHM1NDdTk6'
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  send_email_receipt: true,
                  show_description: true,
                  show_line_items: true,
                  payment_method_types: ['gcash', 'card', 'paymaya'],
                  line_items,
                  success_url: `${url}/api/flight/book`,
                  cancel_url: url,
                  description: 'Tickets payment'
                }
              }
            })
        };
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        if(response.ok){
            const checkoutDataToken = jwt.sign({data: req.body.bookings.flights, class: req.body.bookings.class}, process.env.JWT_SECRET);
            res.cookie('checkoutData', checkoutDataToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json(await response.json());
        }else{
            throw new Error('Payment failed')
        }
    }catch(err){
        const errors = errorHandler(err);
        console.log(errors);
        res.status(400).json(errors);
    }
})

app.get('/api/user',async(req, res) => {
    try{
        const token = req.cookies.jwt;
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                req.userId = decodedToken.id;
                
                const user = await User.findById(decodedToken.id);
                if(user){
                    return res.status(200).json({user: 'user'});
                }

                return res.status(401).json({ error: 'No token found' });
           } catch (error) {
                return res.status(401).json({ error: 'No token found' });
           }
        } else {
            // No token found in cookies
            return res.status(401).json({ error: 'No token found' });
        }

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
})


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
