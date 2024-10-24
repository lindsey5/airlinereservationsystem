import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true
    },
    baggage: {type: String, required: false},
});

export default PassengerSchema;