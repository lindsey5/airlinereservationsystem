import { errorHandler } from '../utils/errorHandler.js';
import Airport from '../model/airport.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NODE_ENV === 'production' ? 'https://airlinereservationsystem.onrender.com' : 'http://localhost:5173';

export const verifyCode = async (req, res) => {
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
};


export const getCountries = async (req, res) => {
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
        res.status(400).json({error: err.message});
    }
};

export const getCities = async (req, res) => {
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
};
export const createPaymentLink = async (req, res) => {
    try{
        const line_items = [
            {currency: 'PHP', amount: 2052 * 100, name: 'Fuel Surcharge', quantity: 1},
            {currency: 'PHP', amount: 687.50 * 100, name: 'PH Passenger Service Charge', quantity: 1},
            {currency: 'PHP', amount: 1296 * 100, name: 'PH-VAT', quantity: 1},
            {currency: 'PHP', amount: 82.50 * 100, name: 'PH PSC Value Added Tax', quantity: 1},
            {currency: 'PHP', amount: 30 * 100, name: 'Aviation Security Fee', quantity: 1},
            {currency: 'PHP', amount: 1344 * 100, name: 'Administration Fee', quantity: 1}
        ];
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
              authorization: `Basic ${process.env.PAYMONGO_KEY}`
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
                  description: 'Flight/s'
                }
              }
            })
        };
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        if(response.ok){
            const checkoutDataToken = jwt.sign({data: req.body.bookings.flights, class: req.body.bookings.class, fareType: req.body.bookings.fareType}, process.env.JWT_SECRET);
            res.cookie('checkoutData', checkoutDataToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json(await response.json());
        }else{
            throw new Error('Payment failed')
        }
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}

export const getUser = async(req, res) => {
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
}