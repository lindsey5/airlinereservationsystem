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

const createSeats = (seats) => {


}

const createClasses = (classes) => {
    return classes.map(classObj => new ClassSchema({
        class: classObj.class,
        seats: createSeats(classObj.seats)
    }))
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

        const flightData = {
            ...data,
            pilot: { name: pilot_name},
            airplane,
        }

        console.log(flightData);

        //const newFlight = new Flight();

    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }

}
