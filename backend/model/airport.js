import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AirportSchema = new Schema({
    airport: { type: String , required: true, unique: true },
    airport_code: { type: String, required: true },
    city: { type: String, required: true},
    country: { type: String, required: true}
}, { timestamps: true });

const Airport = mongoose.model('Airport', AirportSchema);
export default Airport;
