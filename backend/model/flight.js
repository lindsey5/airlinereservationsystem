import mongoose from "mongoose";
import ClassSchema from "./Schema/ClassSchema.js";
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
    airline: { type: String,required: true, },
    flightNumber: { type: String, required: true, unique: true },
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

FlightSchema.pre('save', async function(next) {
    const flight = this;
    if (flight.isNew) {
      const Counter = mongoose.model('Counter', new Schema({ seq: { type: Number, default: 0 } }));
      const counter = await Counter.findOneAndUpdate(
        { _id: 'flightNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      flight.flightNumber = counter.seq;
    }
    next();
  });

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
