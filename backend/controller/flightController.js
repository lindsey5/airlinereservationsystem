import { Schema } from "mongoose";
import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import ClassSchema from "../model/Schema/ClassSchema.js";
import { errorHandler } from "../utils/errorHandler.js";

const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        totalSeats += classObj.seats;
    });
    
    return totalSeats
}

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
            seats: classSeats
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
