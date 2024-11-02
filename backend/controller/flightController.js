import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import Pilot from "../model/pilot.js";
import { searchFlights } from "../service/flightSearchService.js";
import { errorHandler } from "../utils/errorHandler.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        totalSeats += classObj.seats;
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
        const {airplane_id, classes, pilot_id, ...data} = req.body;
        const airplane = await Airplane.findById(airplane_id);
        const pilot = await Pilot.findById(pilot_id);

        if(!airplane){
            throw new Error('Airplane not found');
        }

        if(!pilot){
            throw new Error('Pilot not found')
        }

        await Promise.all([
            pilot.updateOne({ status: 'In Flight' }),
            airplane.updateOne({ status: 'In Flight' })
        ]);

        if (calculateSeats(classes) !== airplane.passengerSeatingCapacity) {
            throw new Error(`The total number of seats must match the seating capacity of the plane. Total plane seating capacity is ${airplane.passengerSeatingCapacity}`);
        }
        const newSeats = createSeats(airplane.passengerSeatingCapacity, airplane.columns);
        
        const newClasses = createClasses(classes, newSeats);
        const flightData = {
            ...data,
            pilot: { id: pilot_id},
            airplane: { id: airplane_id},
            classes: newClasses
        }

        const newFlight = new Flight(flightData);
        await newFlight.save();
        res.status(200).json(newFlight)

    }catch(err){
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
        const flights = await Flight.aggregate([
            {$group: 
                {
                _id: "$arrival.city", 
                totalArrivals: { $sum: 1 }
                }
            },
            { $sort: { totalArrivals: -1 } },
            { $limit: 12 }
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
        const { searchData, flightClass } = req.body;
        const searchResults = await searchFlights(searchData, flightClass);
        res.status(200).json(searchResults);
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
            { status: { $regex: new RegExp(searchTerm, 'i') }},
        ]
    }
    : {};
        const flights = await Flight.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalFlights = await Pilot.countDocuments(searchCriteria);
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
/*
 {
  "airplane_id": "67259c7102b292fd17f149d3",
  "pilot_id": "6724de2ac193dfcd73440606",
  "airline": "Cebu Pacific",
  "departure": {
    "airport": "Davao International Airport",
    "airport_code": "DVO",
    "city": "Davao",
    "country": "Philippines",
    "time": "2024-10-26T12:00:00Z"  
  },
  "arrival": {
    "airport": "Manila International Airport",
    "airport_code": "MNL",
    "city": "Manila",
    "country": "Philippines",
    "time": "2024-10-30T16:00:00Z"
  },
  "classes": [
    {
      "className": "First",
      "seats": 25,
      "price": 10000
    },
    {
      "className": "Business",
      "seats": 50,
      "price": 5000
    },
     {
      "className": "Economy",
      "seats": 75,
      "price": 3000
    }
  ]
}
*/