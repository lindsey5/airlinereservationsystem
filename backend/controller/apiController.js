import { errorHandler } from '../utils/errorHandler.js';
import Airport from '../model/airport.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import dotenv from 'dotenv';
import Flight from '../model/flight.js';
import Airplane from '../model/airplane.js';
import Pilot from '../model/pilot.js';
import Booking from '../model/Booking.js';
import Admin from '../model/Admin.js';
import { get_incomes_today, get_incomes_per_month } from '../service/incomesService.js';
import {get_bookings_per_month} from '../service/bookingService.js';
import FrontDeskAgent from '../model/FrontDeskAgent.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendVerificationCode } from '../service/emailService.js';
import { getPaymentYears } from '../service/paymentService.js';
dotenv.config();

const url = process.env.NODE_ENV === 'production' ? 'https://cloudpeakairlines.onrender.com' : 'http://localhost:5173';

export const send_forgot_password_code = async(req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});

        if(!user) throw new Error('Email doesn\'t exist');

        const verificationCode = await sendVerificationCode(req.body.email)
        res.cookie('verificationCode', verificationCode, {
            maxAge: 60000,
            secure: process.env.NODE_ENV === 'production' 
        });
        res.status(200).json({message: 'Verification Code Successfully sent'});
    }catch(err){
        const errors = errorHandler(err);
        return res.status(400).json({ errors });
    }
}

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
        const line_items = req.body.bookings.line_items
            .map(item => ({...item, amount: Math.round(item.amount * 100)}))
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
                  description: 'Tickets'
                }
              }
            })
        };
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        
        if(response.ok){    
            const result = await response.json();
            const checkoutData = {
                line_items: line_items.map(item => ({...item, amount: Math.round(item.amount / 100)})),
                flights: req.body.bookings.flights, 
                class: req.body.bookings.class,
                fareType: req.body.bookings.fareType, 
                checkout_id: result.data.id,
            }
            req.session.checkoutData = checkoutData;
            console.log(req.session)
            res.status(200).json(result);
        }else{
            throw new Error('Payment failed')
        }
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}

export const getUserType = async(req, res) => {
    try{
        const token = req.cookies.jwt;
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                req.userId = decodedToken.id;
                
                const user = await User.findById(decodedToken.id);
                const admin = await Admin.findById(decodedToken.id);
                const frontDesk = await FrontDeskAgent.findById(decodedToken.id);
                if(user){
                    return res.status(200).json({user: 'user'});
                }
                if(admin){
                    return res.status(200).json({user: 'admin'});
                }

                if(frontDesk){
                    return res.status(200).json({user: 'front-desk'});
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
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}

export const getDashboardDetails = async (req, res) => {
    try{
        const flights = await Flight.countDocuments({status: 'Scheduled', 'arrival.time' : {$gte: new Date()}});
        const airplanes = await Airplane.countDocuments({status: 'Assigned'});
        const pilots = await Pilot.countDocuments({status: 'Assigned'});
        const totalPilots = await Pilot.countDocuments();
        const totalAirplanes = await Airplane.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const totalFrontDesks = await FrontDeskAgent.countDocuments();

        const incomesToday = await get_incomes_today();
        const incomesPerMonth = await get_incomes_per_month(req.query.year);
        const bookingsPerMonth = await get_bookings_per_month(req.query.year);
        const years = await getPaymentYears()

        const data = {
            scheduledFlights: flights,
            assignedPlanes: airplanes,
            assignedPilot: pilots,
            totalPilots,
            totalAirplanes,
            totalAdmins,
            totalFrontDesks,
            incomesToday,
            bookingsPerMonth,
            incomesPerMonth,
            years
        }
        res.status(200).json(data);
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}

export const get_popular_destination = async (req, res) => {
    try {
      const popularDestinations = [];
      const year = req.query.year ? Number(req.query.year) : null;

    const query = {
        'flights.status': { $ne: 'Cancelled' }
    }
    if(year){
        query.createdAt = { 
            $gte: new Date(`${year}-01-01T00:00:00Z`),  // Start of the year
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`), // Start of the next year
        }
    }
    const bookings = await Booking.find(query);

      // Get limit from query, default to 5 if not provided
      const limit = parseInt(req.query.limit) || 5;
  
      for (const booking of bookings) {
        for (const flight of booking.flights) {
          const index = popularDestinations.findIndex(destination => destination.city === flight.arrival.city);
          
          // If the destination already exists, increment the total
          if (index > -1) {
            popularDestinations[index].total += flight.passengers.length;
          } else {
            // If it's a new destination, add it to the array
            popularDestinations.push({
              city: flight.arrival.city,
              country: flight.arrival.country,
              total: flight.passengers.length
            });
          }
        }
      }
  
      // Sort the destinations based on the total passengers
      popularDestinations.sort((a, b) => b.total - a.total);
  
      // Limit the number of destinations returned
      const limitedDestinations = popularDestinations.slice(0, limit);
  
      // If no destinations found, send a 400 response
      if (limitedDestinations.length === 0) {
        return res.status(400).json({ message: "No popular destinations yet" });
      }
  
      // Send the sorted and limited destinations as the response
      return res.status(200).json(limitedDestinations);
  
    } catch (err) {
      // Handle errors with the errorHandler (ensure it's defined elsewhere)
      const errors = errorHandler(err);
      return res.status(400).json({ errors });
    }
  };
  

const formatDate = (date) => {
    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
}

//GEMINI_API_KEY=AIzaSyCNmxh93Y4CByup2KWsS0pCoSnUqKsdVUc
export const chat_a_bot = async (req, res) => {
    try{
        const flights = await Flight.find({ 
            status: 'Scheduled',
            'classes.seats.status': 'available', // Ensure the seat status in the class is 'available'
            'departure.time': { $gte: new Date().setHours(new Date().getHours() + 3) } // Ensure the departure time is in the future
        });

        const popularDestinations = [];
        const bookings = await Booking.find({'flights.status' : {$ne: 'Cancelled'}});
        const limit = 5;
        
        for(const booking of bookings){
            for(const flight of booking.flights){
                const index = popularDestinations.findIndex(destination => destination.city === flight.arrival.city)
                if(index< 0){
                    popularDestinations.push({
                        city: flight.arrival.city,
                        country: flight.arrival.country,
                    })
                }
                if(popularDestinations.length === limit) break;
            }
        }

        const prompt = req.body.prompt;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `
            Today is ${formatDate(new Date())}
            You are an assistant for an airline reservation system don't Do not take the customer's details.. Follow these rules strictly:
            1. Flights cannot be canceled within 24 hours of the departure date.
            2. Flight cancellation is only allowed for Gold Tier tickets.
            3. Flight date changes are not allowed.
            4. Seat selection is available for Silver and Gold Tier fares only.
            5. Tickets are sent to your account email address.
            6. Passenger details can only be modified if the current time is more than 2 hours before departure.
            7. Seat Selection is for Silver and Gold Tier
            8. If you miss your flight, you may need to rebook and pay for a new ticket. 
            9. Extra baggage can be added for a fee  
            10. If you cancel a flight it will be automatically refunded 
            11. Cancellation is for Gold Tier Only 
            12. We accept credit/debit cards, GCash, and Maya.
            13. To check your flight status, simply click the button on the top right of the page and select "My Flights" to view your current bookings and flight status.
            14. There's a 20% discount and tax exemption for PWD and senior citizen for domestic flights
            15. In the Philippines, the law that provides a 20% discount for senior citizens and persons with disabilities (PWDs) is Republic Act No. 9994 (Expanded Senior Citizens Act of 2010) and Republic Act No. 7277 (Magna Carta for Disabled Persons). Additionally, Republic Act No. 8424 (Tax Reform Act of 1997) grants tax exemptions for senior citizens and PWDs. These laws outline the benefits such as discounts, exemptions, and other privileges available to qualified individuals.
            Fare Tier Details:
            - Bronze: Non-refundable, 1 hand-carry baggage (7kg), no seat selection.
            - Silver: +PHP 1120 per passenger, non-refundable, 1 hand-carry baggage (7kg), 1 checked baggage (20kg), preferred seat selection.
            - Gold: +PHP 3000 per passenger, fully refundable, 1 hand-carry baggage (7kg), 1 checked baggage (20kg), priority check-in, priority baggage handling, unlimited lounge access, preferred seat selection.
            Prompt "There is No available flight for ___"
            If they asked what are the available flights, ask them to what is the departure city and arrival city
            Available Flights are: 
                ${
                    flights.map(flight => {
                        return `${flight.departure.airport}(${formatDate(new Date(flight.departure.time))}) 
                        to ${flight.arrival.airport} (${formatDate(new Date(flight.arrival.time))}) 
                        prices: ${flight.classes.map(classObj => `${classObj.className} (${classObj.price})`)}\n`
                    })
                }
            Popular Destinations are: 
                ${
                    popularDestinations.map(destination => {
                        return `${destination.city}, ${destination.country}\n`
                    })
                }
            Answer only the message that related to flight reservation
            `,
          });

          const result = await model.generateContentStream(prompt);

          let fullResponse = '';
          for await (const chunk of result.stream) {
            fullResponse += chunk.text();
          }
          res.status(200).json({ message: fullResponse });
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}
