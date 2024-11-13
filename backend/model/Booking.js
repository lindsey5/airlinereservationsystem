import mongoose from "mongoose";
import PassengerSchema from "./Schema/PassengerSchema.js";
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: { type: String, required: true },
    flight_id: { type: String, required: true },
    passengers: { type: [PassengerSchema], required: true},
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
