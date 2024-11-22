import Booking from "../model/Booking.js";
import { errorHandler } from "../utils/errorHandler.js"

export const getBookings = async (req, res) => {
    const user_id = req.userId;

    try{
        const bookings = await Booking.find({
            user_id,
        }).sort({createdAt: -1})

        for(const booking of bookings){
            for(let i = 0; i < booking.flights.length; i++){
                if((req.query.filter === 'Cancelled' && 
                    booking.flights[i].status !== 'Cancelled')
                    || 
                    (req.query.filter === 'Upcoming' && 
                        (booking.flights[i].departure.time < new Date() || 
                        booking.flights[i].status !== 'Booked'))
                    || (req.query.filter === 'Completed' && booking.flights[i].status !== 'Completed') ||
                    (req.query.filter === 'In-Flight' && booking.flights[i].status !== 'In-Flight')
                    ){
                    booking.flights.splice(i, 1);
                }
            }
        }

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