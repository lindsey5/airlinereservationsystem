import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import { errorHandler } from "../utils/errorHandler.js";

const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        totalSeats += classObj.seats;
    });
    
    return totalSeats
}
//This function generateSeats with seathNumber based on total seats and columns of the airplane
const createSeats = (totalSeats, columns) => {
    const newSeats = [];
    let num = 1;
    for(let i = 0; i < totalSeats / columns; i++){
        for(let j = 0; j < columns; j++){
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
        const {airplane_id, classes, pilot_name, ...data} = req.body;
        const airplane = await Airplane.findById(airplane_id);

        if(!airplane){
            throw new Error('Airplane doesn\'t exist');
        }
        if (calculateSeats(classes) !== airplane.passengerSeatingCapacity) {
            throw new Error(`The total number of seats must match the seating capacity of the plane. Total plane seating capacity is ${airplane.passengerSeatingCapacity}`);
        }
        const newSeats = createSeats(airplane.passengerSeatingCapacity, airplane.columns);
        const newClasses = createClasses(classes, newSeats);
        const flightData = {
            ...data,
            pilot: { name: pilot_name},
            airplane,
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
/*
{
  "airplane_id": "671a2505c5f7525b56fb38fb",
  "pilot_name": "Lindsey Samson",
  "airline": "Cebu Pacific",
  "departure": {
    "airport": "Davao International Airport",
    "city": "Davao",
    "country": "Philippines",
    "time": "2024-10-26T12:00:00Z"  
  },
  "arrival": {
    "airport": "Manila International Airport",
    "city": "Manila",
    "country": "Philippines",
    "time": "2024-10-30T16:00:00Z"
  },
  "classes": [
    {
      "className": "First",
      "seats": 20,
      "price": 10000
    },
    {
      "className": "Business",
      "seats": 30,
      "price": 5000
    },
     {
      "className": "Economy",
      "seats": 50,
      "price": 3000
    }
  ]
}
*/