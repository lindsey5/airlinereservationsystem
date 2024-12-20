import Booking from "../model/Booking.js";
import Flight from "../model/flight.js";
import FrontDeskAgent from "../model/FrontDeskAgent.js";
import Payment from "../model/Payment.js";
import User from "../model/user.js";
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
        const startDate = req.query.from ? new Date(req.query.from) : null;
        const endDate = req.query.to ? new Date(req.query.to) : null;

        // Normalize the start and end dates to ensure they're full date ranges
        if (startDate) {
            startDate.setHours(0, 0, 0, 0);  // Set to start of the day
        }
        if (endDate) {
            endDate.setHours(23, 59, 59, 999);  // Set to end of the day
        }

        // Initialize the query for Payments
        let paymentQuery = {};

        // If searchTerm is provided, filter payments based on fields
        if (searchTerm) {
            paymentQuery = {
                $or: [
                    { status: { $regex: new RegExp(searchTerm, 'i') } },
                    { payment_method: { $regex: new RegExp(searchTerm, 'i') } }
                ]
            };
        }

        // Add date range filter if provided
        if (startDate && endDate) {
            paymentQuery.createdAt = { $gte: startDate, $lte: endDate };
        }

        
        if (searchTerm) {
            // Filter bookings based on booking_ref
            const booking = await Booking.findOne({
                $or: [
                    {booking_ref: { $regex: new RegExp(searchTerm, 'i') }},
                    {booked_by: { $regex: new RegExp(searchTerm, 'i') }},
                    {user_id: { $regex: new RegExp(searchTerm, 'i') }}
                ]
            });

            // If there are any bookingIds, filter the payments by booking_id
            if (booking) {
                paymentQuery.$or.push({booking_id: booking._id.toString()});
            }

            const flight = await Flight.findOne({
                flight_number: { $regex: new RegExp(searchTerm, 'i') }
            })

            if(flight){
                paymentQuery.$or.push({flight_id: flight._id.toString()});
            }
        }

        // Fetch payments based on the constructed query
        const payments = await Payment.find(paymentQuery)
            .populate('booking_id')
            .populate('flight_id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total payments for pagination
        const totalPayments = await Payment.countDocuments(paymentQuery);
        const totalPages = Math.ceil(totalPayments / limit);

        // Map the payments to include booking_ref and booked_by details
        const completedPayments = await Promise.all(
            payments.map(async (payment) => {
                let booked_by;
                if(payment.booking_id.booked_by){
                    const front_desk = await FrontDeskAgent.findById(payment.booking_id.booked_by);
                    booked_by = `${front_desk.email} (Front Desk)`
                }else{
                    const user = await User.findById(payment.booking_id.user_id);
                    booked_by = `${user.email} (User)`
                }
                return {
                    ...payment.toJSON(),
                    booking_ref: payment.booking_id.booking_ref || '',
                    booked_by
                };
            })
        )

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
