import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AirPlaneSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    airline: {
        type: String, 
        required: true
    },
    model: {
        type: String,
        required: true,
    },
    currentLocation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'In Flight', 'Unavailable'], 
        default: 'Available'
    },
    classes: [{
        seats: {
            type: Number,
            required: true,
        }, 
        columns: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            required: true
        }
    }],
    added_by: {
        type: String,
        required: true
    }
})

export default AirPlaneSchema