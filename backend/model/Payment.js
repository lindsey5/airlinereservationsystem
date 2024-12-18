import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    booking_id: { type: String, required: true, ref: 'Booking' },
    payment_method: { 
        type: String, 
        required: true, 
        default: 'Online Payment',
        enum: ['Online Payment', 'Cash']
    },
    flight_id: { type: String },
    total_amount: { type: Number, required: true },
    status: {type: String, enum: ['paid', 'refunded'], default: 'paid'},
    line_items: {
        type: [{
            amount: { type: Number, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true }
        }],
        required: true
    },
    payment_date: {
        type: String, 
        required: true,
        default: new Date().toISOString().split('T')[0]
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
