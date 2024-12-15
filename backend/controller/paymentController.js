import Booking from "../model/Booking.js";
import Payment from "../model/Payment.js";
import { errorHandler } from "../utils/errorHandler.js"

export const get_payment = async (req,res) => {
    try{
        const { booking_id, flight_id } = req.query;
        const payment = await Payment.findOne({
            booking_id,
            flight_id,
        });
        
        res.status(200).json(payment);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

export const get_payments = async (req, res) => {
    try{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const startDate = req.query.from ? new Date(req.query.from).toISOString().split('T')[0] : null;
    const endDate = req.query.to ? new Date(req.query.to).toISOString().split('T')[0] : null;

    const query = {}
    if(startDate && endDate){
        query.payment_date = { $gte: startDate, $lte: endDate };
    }

    const payments = await Payment.find(query).sort({createdAt: -1}).skip(skip).limit(limit);

    const completedPayments = await Promise.all(payments.map(async (payment) => {
        const booking = await Booking.findById(payment.booking_id);
        return {...payment.toJSON(), booking_ref: booking.booking_ref, booked_by: booking.booked_by ? `${booking.booked_by} (Front Desk)` : `${booking.user_id} (User)`}

    }))

    const totalFlights = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalFlights / limit);
    
    res.status(200).json({currentPage: page, totalPages, payments: completedPayments})

    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}