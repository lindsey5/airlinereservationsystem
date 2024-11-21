import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AirPlaneSchema = new Schema({
    model: {
        type: String,
        required: true,
    },
    currentLocation: {
        type: String,
        required: true
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
        enum: ['Available', 'Assigned', 'In Flight', 'Unavailable'], 
        default: 'Available'
    },
    added_by: {
        type: String,
        required: true
    }
})

export default AirPlaneSchema