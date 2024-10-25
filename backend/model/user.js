import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    username: {
        type: String,
        required: true,
        unique:  true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    }
}, {timestamps: true });

const User = mongoose.model('client', UserSchema);
export default User