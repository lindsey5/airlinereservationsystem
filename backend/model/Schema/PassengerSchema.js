import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from "uuid";

const PassengerSchema = new Schema({
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    nationality:{
      type: String,
      required: true,
    },
    countryOfIssue: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Adult', 'Child'],
      default: 'Adult'
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
    pwd: {
      type: Boolean,
      required: true,
      default: false,
    },
    senior_citizen: {
      type: Boolean,
      required: true,
      default: false,
    },
    ticketNumber: {
      type: String,
      required: true,
      default: uuidv4()
  },
});

export default PassengerSchema;