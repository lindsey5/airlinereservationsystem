import mongoose from "mongoose";
import PassengerSchema from "./PassengerSchema.js";
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
    seatNumber: {type: String, required: true},
    status: { type: String, enum: ['available', 'reserved'], default: 'available' },
    passenger: { type: PassengerSchema},
},  { timestamps: true });

export default SeatSchema