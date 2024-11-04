import mongoose from "mongoose";
import ClassSchema from "./Schema/ClassSchema.js";
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
    airline: { type: String,required: true, },
    status: { type: String, default: 'Scheduled'},
    gate_number: { type: String, required: true}, 
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
    airplane: { id: { type: String, required: true } },
    pilot: { 
        captain: {
            type:String, required: true
        },
        co_pilot: {
            type: String, required: true,
        }
     },
    classes: { type: [ClassSchema], required: true,}
}, { timestamps: true });

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
