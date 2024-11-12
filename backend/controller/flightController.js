import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import Pilot from "../model/pilot.js";
import User from "../model/user.js";
import { multi_city_search, one_way_search, round_trip_search } from "../service/flightSearchService.js";
import { errorHandler } from "../utils/errorHandler.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../service/emailService.js";
const { ObjectId } = mongoose.Types;

const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        if(classObj){
            totalSeats += parseInt(classObj.seats);
        }
    });
    
    return totalSeats
}
//This function generateSeats with seathNumber based on total seats and columns of the airplane
const createSeats = (totalSeats, columns) => {
    const totalColumns = columns.split('x').map(column => parseInt(column, 10));
    const sumOfColumns = totalColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const newSeats = [];
    let num = 1;
    for(let i = 0; i < totalSeats / sumOfColumns; i++){
        for(let j = 0; j < sumOfColumns; j++){
            const letter = String.fromCharCode(65 + j);
            newSeats.push({
                    seatNumber: `${letter}${num}`,
            });
        }
        num++;
    }
    return newSeats;
};

// This function generate flight classes
const createClasses = (classes, seats) => {
    let offset = 0;
    const newClasses = classes.map(classObj => {
        const classSeats = [];
        for(let i=0; i <classObj.seats; i++){
            classSeats.push(seats[offset]);
            offset++;
        }
        return {
            className: classObj.className,
            price: classObj.price,
            seats: classSeats,
        }
    })
    return newClasses;
}

export const create_flight = async (req, res) => {
    try{
        const {airplane: {id : airplane_id}, classes, captain, co_pilot, ...data} = req.body;
        const [airplane, captainPilot, coPilot ] = await Promise.all([
            await Airplane.findById(airplane_id),
            await Pilot.findById(captain),
            await Pilot.findById(co_pilot)
        ]);
        // Manually specifying the order
        const order = ['First', 'Business', 'Economy'];

        const rearranged = order.map(name => {
            return classes.find(obj => obj.className === name);
        });

        const filtered = rearranged.filter(item => item !== undefined);

        if(!airplane){
            throw new Error('Airplane not found');
        }

        if(!captainPilot){
            throw new Error('Captain not found')
        }

        if(!coPilot){
            throw new Error('Co-pilot not found');
        }

        await Promise.all([
            captainPilot.updateOne({ status: 'Assigned' }),
            coPilot.updateOne({ status: 'Assigned' }),
            airplane.updateOne({ status: 'Assigned' })
        ]);

        if (calculateSeats(filtered) !== airplane.passengerSeatingCapacity) {
            throw new Error(`The total number of seats must equal the plane's seating capacity of ${airplane.passengerSeatingCapacity} (${airplane.columns}).`);
        }
        const newSeats = createSeats(airplane.passengerSeatingCapacity, airplane.columns);
        
        const newClasses = createClasses(filtered, newSeats);
        const flightData = {
            ...data,
            pilot: { captain, co_pilot },
            airplane: { id: airplane_id},
            classes: newClasses
        }

        const newFlight = new Flight(flightData);
        await newFlight.save();
        res.status(200).json(newFlight)
    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_flight = async (req, res) => {
    try{
        const id = req.params.id;
        const flight = await Flight.findById(id);
        if(!flight){
            throw new Error('Flight not found');
        }
        res.status(200).json({flight});
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_popular_destination = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit);
        const flights = await Flight.aggregate([
            {$group: 
                {
                _id: "$arrival.city", 
                country:{ $first: "$arrival.country" },
                totalArrivals: { $sum: 1 }
                }
            },
            { $sort: { totalArrivals: -1 } },
            { $limit: limit }
        ]);
        if(!flights){
            throw new Error('No popular destination found');
        }
        res.status(200).json(flights);
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const search_flight = async (req, res) => {
    try{
        const { searchData, flightClass, flightType, price } = req.body;
        
        let searchResults;
        if(flightType === 'One Way'){
            searchResults = await one_way_search(searchData[0], flightClass, price);
        }else if(flightType === 'Round Trip'){
            searchResults = await round_trip_search(searchData[0], flightClass, price);
        }else {
            searchResults = await multi_city_search(searchData, flightClass, price);
        }

        res.status(200).json(searchResults);
    }catch(err){
        console.log(err);
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_available_flights = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const flightClass = req.query.flightClass || 'Economy';
    try{
        const flights = await Flight.find({ 
            status: { $nin: ['Completed', 'Cancelled'] }, 
            'classes.className' : flightClass,  
            'classes.seats.status' : 'available',
            'departure.time': {$gte: new Date()}
        })
        const sortedFlights = flights.sort((current, next) => 
            current.classes.find(classObj => classObj.className === flightClass).price - 
            next.classes.find(classObj => classObj.className === flightClass).price
        )

        res.status(200).json(sortedFlights.slice(0, limit));

    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_flights = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;
    
    try{
        const searchCriteria = searchTerm
    ? {
        $or: [
            { _id: ObjectId.isValid(searchTerm) ? new ObjectId(searchTerm) : null },
            { 'departure.airport': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.city': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.country': { $regex: new RegExp(searchTerm, 'i') } },
            { 'arrival.aiport' : { $regex: new RegExp(searchTerm, 'i') }},
            { 'arrival.aiport_code' : { $regex: new RegExp(searchTerm, 'i') } },
            { 'arrival.city' : { $regex: new RegExp(searchTerm, 'i') }},
            { 'arrival.country' : { $regex: new RegExp(searchTerm, 'i') } },
            { 'airplane.id': { $regex: new RegExp(searchTerm, 'i') } },
            { 'pilot.captain': { $regex: new RegExp(searchTerm, 'i') } },
            { 'pilot.co_pilot': { $regex: new RegExp(searchTerm, 'i') } },
            { flightNumber: { $regex: new RegExp(searchTerm, 'i') } },
            { status: { $regex: new RegExp(searchTerm, 'i') }},
        ]
    }
    : {};
        const flights = await Flight.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalFlights = await Flight.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalFlights / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            flights
        });
    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const book_flight = async (req, res) => {
    try{
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const checkoutData = jwt.verify(req.cookies.checkoutData, process.env.JWT_SECRET);
        const user = await User.findById(id);

        checkoutData.data.forEach(flight => {
            flight.passengers.forEach(async (passenger) => {
                const available_flight = await Flight.findOne({
                    _id: flight.id, 
                    'classes.className': checkoutData.class, 
                });
                const classIndex =  available_flight.classes.findIndex(classObj => classObj.className === checkoutData.class);
                const seatIndex = available_flight.classes[classIndex].seats.findIndex(seat => seat.status === 'available');
                
                if(seatIndex > -1){
                    available_flight.classes[classIndex].seats[seatIndex].status = 'booked';
                    available_flight.classes[classIndex].seats[seatIndex].passenger = passenger;
                    const updatedFlight = await available_flight.save();
                    const data =  {
                        id: updatedFlight._id, 
                        seatNumber: available_flight.classes[classIndex].seats[seatIndex].seatNumber
                    }
                    sendEmail(user.email, data);
                }
            })
        })
        res.redirect(`/`);
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}
