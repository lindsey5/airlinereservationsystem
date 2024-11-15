import Booking from "../model/Booking.js";
import Flight from "../model/flight.js";
import { errorHandler } from "../utils/errorHandler.js"

export const getScheduledBookings = async (req, res) => {
    const user_id = req.userId;
    try{
        const bookings = await Booking.find({
            user_id,
            status: 'Scheduled'
        })

        const completeBookingsDetails = await Promise.all(bookings.map(async (booking) => {
            const flight = await Flight.findById(booking.flight_id);
            const { departure, arrival, status } = flight;  
            const { _id, user_id, flight_id, passengers, status: book_status } = booking;  
            const flightDetails = { departure, arrival, status };
            const flightBooking = { _id, user_id, flight_id, passengers, status: book_status }; 

            return { ...flightDetails, ...flightBooking }; 
        }));
        
        res.status(200).json(completeBookingsDetails);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}