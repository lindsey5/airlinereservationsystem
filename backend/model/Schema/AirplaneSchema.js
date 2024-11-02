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
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'In Flight', 'Unavailable'], 
        default: 'Available'
    }
})

export default AirPlaneSchema