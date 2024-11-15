import mongoose from "mongoose";
import PassengerSchema from "./Schema/PassengerSchema.js";
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: { type: String },
    booked_by: { type: String},
    flight_id: { type: String, required: true },
    passengers: { type: [PassengerSchema], required: true},
    status: {type: String, enum: ['Booked', 'Completed', 'Cancelled'], default: 'Booked'}
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
