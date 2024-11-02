import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PilotSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'In Flight', 'Unavailable'],
        default: 'Available',
    }

}, { timestamps: true });

const Pilot = mongoose.model('Pilot', PilotSchema);
export default Pilot;
