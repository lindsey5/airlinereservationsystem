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
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.searchTerm;
        const startDate = req.query.from ? new Date(req.query.from).toISOString().split('T')[0] : null;
        const endDate = req.query.to ? new Date(req.query.to).toISOString().split('T')[0] : null;

        // Initialize the query for Payments
        let paymentQuery = {};

        // If searchTerm is provided, filter payments based on fields
        if (searchTerm) {
            paymentQuery = {
                $or: [
                    { status: { $regex: new RegExp(searchTerm, 'i') } }
                ]
            };
        }

        // Add date range filter if provided
        if (startDate && endDate) {
            paymentQuery.payment_date = { $gte: startDate, $lte: endDate };
        }

        if (searchTerm) {
            // Filter bookings based on booking_ref
            const booking = await Booking.findOne({
                booking_ref: { $regex: new RegExp(searchTerm, 'i') }
            });
            console.log(booking)
            // If there are any bookingIds, filter the payments by booking_id
            if (booking) {
                paymentQuery.$or.push({booking_id: booking._id.toString()});
            }
        }

        // Fetch payments based on the constructed query
        const payments = await Payment.find(paymentQuery)
            .populate('booking_id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total payments for pagination
        const totalPayments = await Payment.countDocuments(paymentQuery);
        const totalPages = Math.ceil(totalPayments / limit);

        // Map the payments to include booking_ref and booked_by details
        const completedPayments = payments.map(payment => {
            return {
                ...payment.toJSON(),
                booking_ref: payment.booking_id.booking_ref,
                booked_by: payment.booking_id.booked_by
                    ? `${payment.booking_id.booked_by} (Front Desk)`
                    : `${payment.booking_id.user_id} (User)`
            };
        });

        // Return the response
        res.status(200).json({
            currentPage: page,
            totalPages,
            payments: completedPayments,
        });

    } catch (err) {
        console.log(err);
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
};
