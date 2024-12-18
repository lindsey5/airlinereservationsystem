import mongoose from "mongoose";
import ClassSchema from "./Schema/ClassSchema.js";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Delivered', 'Seen'],
        default: 'Delivered',
        required: true,
    },
    flight: {
        type: {
            flightNumber: { type: String, unique: true },
            airline: { type: String,required: true, },
            status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'Cancelled', 'In-Flight', 'Completed']},
            gate_number: { type: String, required: true}, 
            departure: {
                airport: { type: String, required: true, },
                airport_code: { type: String, required: true},
                city: { type: String, required: true,},
                country: { type: String, required: true },
                time: { type: Date, required: true, },
            },
            arrival: {
                airport: {type: String, required: true},
                airport_code: { type: String, required: true},
                city: {type: String, required: true},
                country: { type: String, required: true },
                time: {type: Date, required: true},
            },
            airplane: { code: { type: String, required: true} } ,
            pilot: { 
                captain: {
                    type:String, required: true
                },
                co_pilot: {
                    type: String, required: true,
                }
             },
            classes: { type: [ClassSchema], required: true,},
            added_by: { type: String, required: true }
        }
    }

}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
