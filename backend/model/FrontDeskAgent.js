import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const FrontDeskAgentSchema = new Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    added_by: {
        type: String,
        required: true
    }
}, { timestamps: true })

FrontDeskAgentSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const FrontDeskAgent = mongoose.model('FrontDeskAgent', FrontDeskAgentSchema);
export default FrontDeskAgent