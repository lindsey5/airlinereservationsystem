import mongoose from "mongoose";
import ClassSchema from "./Schema/ClassSchema.js";
import crypto from 'crypto';
const Schema = mongoose.Schema;

export const FlightSchema = new Schema({
    flightNumber: { type: String  },
    airline: { type: String,required: true, },
    status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'Cancelled', 'In-Flight', 'Completed']},
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
    airplane: { code: { type: String, required: true} } ,
    pilot: { 
        captain: {
            type:String, required: true
        },
        co_pilot: {
            type: String, required: true,
        }
     },
    classes: { type: [ClassSchema], required: true,},
    added_by: { type: String, required: true }
}, { timestamps: true });

FlightSchema.pre('save', function (next) {
    if (this.isNew) {
      const randomFlightNumber = `${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      this.flightNumber = randomFlightNumber;
    }
    next();
});

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
