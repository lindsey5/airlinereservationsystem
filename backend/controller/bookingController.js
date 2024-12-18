import Booking from "../model/Booking.js";
import { errorHandler } from "../utils/errorHandler.js"
import { socketInstance } from "../middleware/socket.js";

export const getBookings = async (req, res) => {
    const user_id = req.userId;

    try{
        const bookings = await Booking.find({ user_id }).sort({ createdAt: -1 });

        for (const booking of bookings) {
            // Create a new filtered array for flights instead of modifying the original array
            booking.flights = booking.flights.filter(flight => {
                const now = new Date();
                const flightStatus = flight.status;
                const flightDepartureTime = new Date(flight.departure.time);
                
                // Check filter conditions based on the query parameter
                if (req.query.filter === 'Cancelled' && flightStatus !== 'Cancelled') {
                    return false; // Exclude this flight
                }
                
                if (req.query.filter === 'Upcoming' && (flightDepartureTime < now || flightStatus !== 'Booked')) {
                    return false; // Exclude this flight
                }
        
                if (req.query.filter === 'Completed' && flightStatus !== 'Completed') {
                    return false; // Exclude this flight
                }
        
                if (req.query.filter === 'In-Flight' && flightStatus !== 'In-Flight') {
                    return false; // Exclude this flight
                }

                socketInstance.emit('notification', { 
                    message: `A new booking has been made for Flight #$.` 
                })
        
                return true; // Include this flight
            });
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