import mongoose from "mongoose";
import PassengerSchema from "./Schema/PassengerSchema.js";
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: { type: String },
    booked_by: { type: String},
    flights: {
        type: [{
            id: {type: String, required: true},
            airline: {type: String, required: true},
            departure: {
                airport: { type: String, required: true, },
                airport_code: { type: String, required: true},
                city: { type: String, required: true,},
                country: { type: String, required: true },
                time: { type: Date, required: true, },
            },
            arrival: {
                airport: {type: String, required: true},
                airport_code: { type: String, required: true},
                city: {type: String, required: true},
                country: { type: String, required: true },
                time: {type: Date, required: true},
            },
            flightNumber: { type: String, required: true },
            gate_number: { type: String, required: true}, 
        }], required: true
    },
    class: { type: String, required: true},
    passengers: { type: [PassengerSchema], required: true},
    fareType: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze'}
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
