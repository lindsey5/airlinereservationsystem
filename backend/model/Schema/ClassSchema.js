import mongoose from "mongoose";
import SeatSchema from "./SeatSchema.js";
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    className: {type: String, enum: ['Economy', 'Business', 'First'], required: true},
    seats:{ type: [SeatSchema], required: true},
});

export default ClassSchema