import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from "uuid";

const PassengerSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['adult', 'child'],
      default: 'adult'
    },
    price: {
      type: Number,
      required: true
    },
    seatNumber: {
      type: String,
      required: true
    },
    ticketStatus: {
      type: String,
      enum: ['Booked', 'Ticketed', 'Cancelled'],
      default: 'Booked'
    },
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      default: uuidv4 
  },
});

export default PassengerSchema;