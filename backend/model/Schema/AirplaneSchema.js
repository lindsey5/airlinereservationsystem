import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AirPlaneSchema = new Schema({
    model: {
        type: String,
        required: true,
    },
    passengerSeatingCapacity: {
        type: Number,
        required: true,
    },
    columns: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'In flight', 'Unavailable'], 
        default: 'Available'
    }
})

export default AirPlaneSchema