import Booking from "../model/Booking.js";
import { errorHandler } from "../utils/errorHandler.js"

export const getBookings = async (req, res) => {
    const user_id = req.userId;
    try{
        const bookings = await Booking.find({
            user_id,
        }).sort({createdAt: -1});
        res.status(200).json(bookings);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}

export const getBooking = async(req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            throw new Error('Booking not found')
        }
        res.status(200).json(booking);
    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}