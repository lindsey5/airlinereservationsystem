import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 } from "uuid";

const uuidv4 = v4;

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
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      default: uuidv4
  },
});

export default PassengerSchema;