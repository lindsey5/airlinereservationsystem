import mongoose from "mongoose";
import airplaneSchema from "./Schema/AirplaneSchema.js";
import ClassSchema from "./Schema/ClassSchema.js";
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
    flightNumber: {
        type: String,
        required: true,
    },
    airline: {
        type: String,
        required: true,
    },
    departure: {
        airport: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true,
        },
    },
    status: { type: String, default: 'Available'},
    arrival: {
        airport: {type: String, required: true},
        city: {type: String, required: true},
        time: {type: Date, required: true},
    },
    airplane: {type: airplaneSchema, required: true},
    pilot: {
      name: {type: String, required: true},
    },
    classes: {
        type: [ClassSchema],  // Array of ClassSchema
        required: true,       // Mark the field as required
    }
}, { timestamps: true });

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
