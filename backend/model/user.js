import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    }
}, {timestamps: true });

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

const User = mongoose.model('user', UserSchema);
export default User