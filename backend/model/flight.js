import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
    name: String,
    ticketNumber: String,
    baggage: String,
})

const SeatSchema = new Schema({
    seatNumber: String,
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    passenger: PassengerSchema
  });
  
  const ClassSchema = new Schema({
    class: String,
    seats: [SeatSchema]
  });
  
  const FlightSchema = new Schema({
    flightNumber: String,
    airline: String,
    departure: {
      airport: String,
      city: String,
      time: Date
    },
    arrival: {
      airport: String,
      city: String,
      time: Date
    },
    aircraft: {
      model: String,
      seatingCapacity: Number
    },
    classes: [ClassSchema]
  }, {timeStamps: true});

export default Flight = mongoose.model('Flight', FlightSchema);
