import mongoose from "mongoose";
import PassengerSchema from "./Schema/PassengerSchema.js";
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: { type: String, required: true },
    flight_id: { type: String, required: true },
    passengers: { type: [PassengerSchema], required: true},
    status: {type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled'}
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
