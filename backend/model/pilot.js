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
        enum: ['Available', 'Assigned', 'In Flight', 'Unavailable'],
        default: 'Available',
    },
    added_by: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Pilot = mongoose.model('Pilot', PilotSchema);
export default Pilot;
