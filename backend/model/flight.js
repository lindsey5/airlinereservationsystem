import mongoose from "mongoose";
import airplaneSchema from "./Schema/AirplaneSchema.js";
import ClassSchema from "./Schema/ClassSchema.js";
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
    airline: { type: String,required: true, },
    status: { type: String, default: 'Scheduled'},
    departure: {
        airport: { type: String, required: true, },
        city: { type: String, required: true,},
        country: { type: String, required: true },
        time: { type: Date, required: true, },
    },
    arrival: {
        airport: {type: String, required: true},
        city: {type: String, required: true},
        country: { type: String, required: true },
        time: {type: Date, required: true},
    },
    airplane: {type: airplaneSchema, required: true},
    pilot: {
      id: { type: Number, required: true},
      name: { type: String, required: true },
    },
    classes: { type: [ClassSchema], required: true,}
}, { timestamps: true });

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
