import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import Pilot from "../model/pilot.js";
import User from "../model/user.js";
import { multi_city_search, one_way_search, reserveSeats, round_trip_search } from "../service/flightService.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { sendTickets } from "../service/emailService.js";
import Booking from "../model/Booking.js";
import { calculateSeats, createSeats, createClasses } from "../utils/flightUtils.js";
import { createPayment, getPaymentId, refundPayment } from "../service/paymentService.js";
import { updatePilotStatus } from '../service/pilotService.js';
import Payment from "../model/Payment.js";
import crypto from 'crypto';

export const create_flight = async (req, res) => {
    try{
        const {airplane: {id : airplane_id}, classes, captain, co_pilot, ...data} = req.body; // Destructured the request body
        
        // Checks if the airplane, captain, and co-pilot ID is exist in the database
        const [airplane, captainPilot, coPilot ] = await Promise.all([
            await Airplane.findById(airplane_id),
            await Pilot.findById(captain),
            await Pilot.findById(co_pilot)
        ]);

        const order = ['First', 'Business', 'Economy']; // Array for arranging the order of the classes from the request body

        // Arranged the order of class
        const rearranged = order.map(name => {
            return classes.find(obj => obj.className === name);
        });

        const filteredClasses = rearranged.filter(item => item !== undefined); // Filtered the rearranged classes

        // Check if the airplane exists in the database
        if(!airplane){
            // If the airplane is not found, throw an error with a descriptive message
            throw new Error('Airplane not found');
        }

        // Check if the captain pilot exists in the database
        if(!captainPilot){
            // If the captain is not found, throw an error with a descriptive message
            throw new Error('Captain not found');
        }

        // Check if the co-pilot exists in the database
        if(!coPilot){
            // If the co-pilot is not found, throw an error with a descriptive message
            throw new Error('Co-pilot not found');
        }

        // Update the status of the captain, co-pilot and aiplane to Assigned
        await Promise.all([
            captainPilot.updateOne({ status: 'Assigned' }),
            coPilot.updateOne({ status: 'Assigned' }),
            airplane.updateOne({ status: 'Assigned' })
        ]);

        // Checks if the filterd classes seats is equal to the airplane seating capacity
        if (calculateSeats(filteredClasses) !== airplane.passengerSeatingCapacity) {
            // Throw an error if it is not equal
            throw new Error(`The total number of seats must equal the plane's seating capacity of ${airplane.passengerSeatingCapacity} (${airplane.columns}).`);
        }

        // Generate seats based on the airplane's seating capacity and the column configuration.
        // The `createSeats` function calculates the total number of seats, taking into account the number of columns and total capacity.
        const newSeats = createSeats(airplane.passengerSeatingCapacity, airplane.columns);

        // Distribute the generated seats to the different flight classes.
        // The `createClasses` function maps the seats to each class based on the number of seats per class and assigns them accordingly.
        const newClasses = createClasses(filteredClasses, newSeats);

        // Prepare the data to create a new flight entry in the database.
        // This object contains the flight's details like the airplane, pilot information, flight classes, and the user who added the flight.
        const flightData = {
            ...data,  // Spread the other flight details (e.g., destination, departure time, etc.)
            pilot: { captain, co_pilot },  // Add pilot information to the flight data
            airplane: { id: airplane_id },  // Associate the flight with the airplane by its ID
            classes: newClasses,  // Assign the distributed class information with seats to the flight
            added_by: req.userId  // Track the user who is creating the flight
        };

        // Create a new `Flight` document using the prepared `flightData` object.
        const newFlight = new Flight(flightData);

        // Save the new flight document to the database.
        await newFlight.save();

        res.status(200).json(newFlight)
    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_flight = async (req, res) => {
    try{
        const id = req.params.id;
        const flight = await Flight.findById(id);
        if(!flight){
            throw new Error('Flight not found');
        }
        res.status(200).json({flight});
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

// Function to search for flights based on user input
export const search_flight = async (req, res) => {
    try {
        // Destructure search data and other search criteria from the request body
        const { searchData, flightClass, flightType, price } = req.body;
        
        let searchResults;

        // Check the type of flight search (One Way, Round Trip, or Multi-City)
        if (flightType === 'One Way') {
            // If it's a one-way flight, call the one_way_search function
            searchResults = await one_way_search(searchData[0], flightClass, price);
        } else if (flightType === 'Round Trip') {
            // If it's a round-trip flight, call the round_trip_search function
            searchResults = await round_trip_search(searchData[0], flightClass, price);
        } else {
            // If it's a multi-city flight, call the multi_city_search function
            searchResults = await multi_city_search(searchData, flightClass, price);
        }

        // Return the search results with a 200 status code
        res.status(200).json(searchResults);

    } catch (err) {
        // Handle any errors that occur during the search process
        const errors = errorHandler(err);
        
        // Return the error details with a 400 status code
        res.status(400).json({ errors });
    }
}

// Function to get available flights based on search filters
export const get_available_flights = async (req, res) => {
    // Parse query parameters for the limit and flight class
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
    const flightClass = req.query.selectedClass || 'Economy'; // Default to 'Economy' class if not provided
    const searchTerm = req.query.searchTerm;

    try {
        const query = { 
            $or: [
                {'departure.city' : { $regex: new RegExp(searchTerm, 'i') }},
                {'arrival.city' : { $regex: new RegExp(searchTerm, 'i') }}
            ],
            status: 'Scheduled',
            'classes': {
                $elemMatch: { className: flightClass, 'seats.status' : 'available' },
            },
            'departure.time': { $gte: new Date().setHours(new Date().getHours() + 3) } // Ensure the departure time is in the future
        }
        // Find flights that meet the following criteria:
        // - Status is not 'Completed' or 'Cancelled'
        // - The specified class (e.g., 'Economy') has available seats
        // - The flight's departure time is in the future (greater than or equal to the current time)
        const flights = await Flight.find(query).limit(limit);

        // Sort the flights by price (ascending order) based on the selected flight class
        const sortedFlights = flights.sort((current, next) => 
            current.departure.time - next.departure.time
        );
        const totalFlights = await Flight.countDocuments(query);

        // Return the sorted flights, limiting the results to the specified number (e.g., 10)
        res.status(200).json({flights: sortedFlights, totalFlights});
    } catch (err) {
        // If an error occurs, handle it and send a 400 status with the error message
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
}

// Controller function to get paginated and filtered list of flights
export const get_flights = async (req, res) => {
    // Parse page and limit values from query parameters (defaults if not provided)
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; // Calculate the number of records to skip for pagination
    const type = req.query.type;
    const {departureTime, arrivalTime} = req.query;
    // Capture the search term for filtering flights (if provided)
    const searchTerm = req.query.searchTerm;

    try {
        // If a search term is provided, construct the search criteria using regular expressions for flexible matching
        const searchCriteria = searchTerm
            ? {
                $or: [
                    // Searching in various fields such as departure and arrival airports, cities, countries, etc.
                    { 'departure.airport': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'departure.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'departure.city': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'arrival.airport': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'arrival.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'arrival.city': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'airplane.id': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'pilot.captain': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'pilot.co_pilot': { $regex: new RegExp(searchTerm, 'i') } },
                    { flightNumber: { $regex: new RegExp(searchTerm, 'i') } },
                ],
            }
            : {}; // If no search term, no filtering is applied
        if(req.query.status !== 'All') searchCriteria.status = req.query.status;
        if(departureTime) searchCriteria['departure.time'] = {
            $gte: new Date(req.query.departureTime), 
            $lte: new Date(req.query.departureTime).setHours(23, 59, 59, 999)
        }
        if(arrivalTime) searchCriteria['arrival.time'] = {
            $gte: new Date(req.query.arrivalTime), 
            $lte: new Date(req.query.arrivalTime).setHours(23, 59, 59, 999)
        };
        
        if (type === 'Domestic') {
            searchCriteria['departure.country'] = 'Philippines';
            searchCriteria['arrival.country'] = 'Philippines';
        }
        // Fetch flights based on search criteria, sorted by creation date (newest first)
        const flights = await Flight.find(searchCriteria)
            .sort({ 'departure.time': -1 }) 
            .skip(skip)               // Skipping records based on the pagination parameters
            .limit(limit);            // Limiting the number of records returned based on the limit
        const filteredFlights = type === 'International' ? flights
        .filter(flight => flight.departure.country !== 'Philippines' || flight.arrival.country !== 'Philippines') 
        : flights;

        // Get the total number of flights matching the search criteria (for pagination)
        const totalFlights = await Flight.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalFlights / limit);  // Calculate the total number of pages

        // Return the current page, total pages, and the flight data
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            flights: filteredFlights
        });
    } catch (err) {
        console.log(err)
        // Handle any errors and return a response with the error details
        const errors = errorHandler(err);
        res.status(400).json({ errors });
    }
}

// User flight booking function to handle the booking process for a user.
export const user_book_flight = async (req, res) => {
    try {
        // Extract JWT token from the cookies and verify it to get the user's ID
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);  // Decode the JWT to get the user's ID
        const id = decodedToken.id;  // User's ID from the decoded token

        // Extract the checkout data from cookies and verify it to ensure integrity
        const checkoutData = req.session.checkoutData
        // Find the user in the database using the ID from the decoded token
        const user = await User.findById(id);
        // Reserve seats based on the checkout data (this function updates seat availability)
        await reserveSeats(checkoutData);
        // Prepare an array to hold the flight details for the user's booking
        const flights = [];

        // Iterate over each flight in the checkout data to fetch detailed flight information
        for (const flight of checkoutData.flights) {
            // Fetch the full details of each flight using its ID
            const flightDetails = await Flight.findById(flight.id);
            const passengers = flight.passengers.map(passenger => {
                // Check if the passenger qualifies for a discount (PWD or senior citizen)
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines' 
                && checkoutData.class !== 'First';
                // Apply a 20% discount if the passenger qualifies for the discount
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price
                return {...passenger, price: fareAmount}
            })
            // Prepare the flight data to include all necessary flight details
            const data = {
                id: flight.id,  // Flight ID
                airline: flightDetails.airline,  // Airline for the flight
                departure: flightDetails.departure,  // Departure information
                arrival: flightDetails.arrival,  // Arrival information
                flightNumber: flightDetails.flightNumber,  // Flight number
                gate_number: flightDetails.gate_number,  // Gate number for the flight
                passengers
            };

            // Push the detailed flight data to the `flights` array
            flights.push(data);
        }
        // Create a new booking record in the database with the user's information and flight details
        const booking = await Booking.create({
            user_id: user._id,  // Link the booking to the user by their ID
            flights,  // Include the detailed flight information in the booking
            class: checkoutData.class,  // Class selected (e.g., Economy, Business)
            fareType: checkoutData.fareType,  // Fare type (e.g., "Bronze", "Silver", "Gold")
            payment_checkout_id: checkoutData.checkout_id,  // Checkout ID for payment tracking
            booking_ref: `${crypto.randomBytes(4).toString('hex').toUpperCase()}`
        });

        // Create a payment record associated with the booking
        await createPayment(checkoutData, booking._id);

        // Save the newly created booking to the database
        await booking.save();
        res.clearCookie('checkoutData');
        // Send the ticket details to the user via email
        sendTickets(user.email, booking._id, booking, checkoutData.line_items);

        // Redirect the user to a success page after completing the booking
        res.redirect(`/user/booking/success`);
    } catch (err) {
        // Handle any errors that occur during the booking process
        const errors = errorHandler(err);  // Process the error to extract relevant information
        res.status(400).json({ errors });  // Return an error response with a 400 status
    }
}

// Frontdesk flight booking function for booking flights through the front desk interface.
export const frontdesk_book_flight = async (req, res) => {
    try {
        // Extract booking data from the request body (flights, class, fareType)
        const data = {
            flights: req.body.bookings.flights,  // Array of flight details
            class: req.body.bookings.class,  // Flight class (e.g., Economy, Business)
            fareType: req.body.bookings.fareType,  // Fare type (e.g., "Bronze", "Silver", "Gold")
            line_items: req.body.bookings.line_items
        };

        // Extract email from the request body, which will be used to send ticket details
        const { email } = req.body;

        // Call reserveSeats to ensure the seats for these flights are properly reserved
        await reserveSeats(data);

        // Prepare an array to hold the detailed flight information for the booking
        const flights = [];

        // Loop through each flight in the booking and fetch detailed flight information from the database
        for (const flight of data.flights) {
            // Fetch the full details of the flight using its ID
            const flightDetails = await Flight.findById(flight.id);
            const passengers = flight.passengers.map(passenger => {
                // Check if the passenger qualifies for a discount (PWD or senior citizen)
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines' 
                && data.class !== 'First';
                // Apply a 20% discount if the passenger qualifies for the discount
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price

                return { ...passenger, price: fareAmount}
            }) 

            // Structure the flight data to include relevant information
            const flightData = {
                id: flight.id,  // Flight ID
                airline: flightDetails.airline,  // Airline of the flight
                departure: flightDetails.departure,  // Departure details
                arrival: flightDetails.arrival,  // Arrival details
                flightNumber: flightDetails.flightNumber,  // Flight number
                gate_number: flightDetails.gate_number,  // Gate number for the flight
                passengers,
            };
            // Add the structured flight data to the `flights` array
            flights.push(flightData);
        }

        // Create a new booking record in the database with the provided booking details
        const booking = await Booking.create({
            booked_by: req.userId,  // Store the user ID of the front desk staff who made the booking
            flights,  // Include the flight details in the booking
            class: data.class,  // Store the class (e.g., Economy, Business)
            fareType: data.fareType, // Store the fare type (e.g., Refundable, Non-refundable)
            booking_ref: `${crypto.randomBytes(4).toString('hex').toUpperCase()}`
        });

        // Create a payment record for the booking using the checkout data
        const payment = await createPayment(data, booking._id);
        // Send the booking tickets to the user via email
        sendTickets(email, booking._id, booking, data.line_items);
        await booking.save();
        res.status(200).json(booking);
    } catch (err) {
        console.log(err)
        // If an error occurs, handle it by calling the errorHandler function
        const errors = errorHandler(err);
        
        // Return a response with status code 400 (Bad Request) and the error details
        res.status(400).json({ errors });
    }
};

// Helper function to check if a pilot has a next flight after the current flight
const isPilotHaveNextFlight = async (currentFlight, pilot) => {
    // Search for a flight where the pilot is either captain or co-pilot
    // and the departure is from the same airport as the current flight's arrival airport
    // and the departure time is after the current flight's arrival time.
    const flight = await Flight.findOne({
        $or: [
            { 'pilot.captain': pilot },   // Pilot as captain
            { 'pilot.co_pilot': pilot }   // Pilot as co-pilot
        ],
        'departure.airport': currentFlight.arrival.airport,  // Same departure airport as current flight arrival airport
        'departure.time': { $gt: currentFlight.arrival.time }  // Departure time should be after current flight's arrival time
    });

    // If no such flight is found, the pilot does not have a next flight.
    return !flight ? false : true;
}

// Helper function to check if an airplane has a next flight after the current flight
const isPlaneHaveNextFlight = async (currentFlight, airplane) => {
    // Search for a flight where the airplane has the same ID and the departure is from the same airport as the current flight's arrival airport
    // and the departure time is after the current flight's arrival time.
    const flight = await Flight.findOne({
        'airplane.id': airplane,  // Same airplane ID
        'departure.airport': currentFlight.arrival.airport,  // Same departure airport as current flight arrival airport
        'departure.time': { $gt: currentFlight.arrival.time }  // Departure time should be after current flight's arrival time
    });

    // If no such flight is found, the airplane does not have a next flight.
    return !flight ? false : true;
}

// Function to mark a flight as completed and update the relevant entities (flight, airplane, pilot, bookings)
export const completeFlight = async (req, res) => {
    try {
        // Fetch the flight to be completed using the ID from request parameters
        const updatedFlight = await Flight.findById(req.params.id);
        
        // Update the flight status to 'Completed'
        updatedFlight.status = 'Completed';

        // Fetch the airplane associated with the current flight
        const plane = await Airplane.findById(updatedFlight.airplane.id);
        plane.currentLocation = updatedFlight.arrival.airport;  // Update the airplane's current location to the arrival airport

        // Check if the captain and co-pilot have a next flight
        const [isCaptainHaveNextFlight, isCoPilotHaveNextFlight] = await Promise.all([
            await isPilotHaveNextFlight(updatedFlight, updatedFlight.pilot.captain),
            await isPilotHaveNextFlight(updatedFlight, updatedFlight.pilot.co_pilot)
        ]);

        // If the captain does not have a next flight, update their status
        if (!isCaptainHaveNextFlight) {
            const updatedPilot = await updatePilotStatus(updatedFlight.pilot.captain);
            if (!updatedPilot) throw new Error('Updating captain error');  // Throw error if captain status update fails
        }

        // If the co-pilot does not have a next flight, update their status
        if (!isCoPilotHaveNextFlight) {
            const updatedPilot = await updatePilotStatus(updatedFlight.pilot.co_pilot);
            if (!updatedPilot) throw new Error('Updating co-pilot error');  // Throw error if co-pilot status update fails
        }

        // Check if the airplane does not have a next flight. If so, mark the airplane as 'Available'
        if (!await isPlaneHaveNextFlight(updatedFlight, updatedFlight.airplane.id)) {
            const airplane = await Airplane.findById(updatedFlight.airplane.id);
            airplane.status = 'Available';  // Mark airplane as available
            await airplane.save();
        }

        // Update all bookings that have this flight with the status 'Completed'
        await Booking.updateMany(
            { 'flights.id': req.params.id, 'flights.status': 'In-Flight' },  // Find bookings that have this flight and are in 'Booked' status
            { $set: { 'flights.$.status': 'Completed' } }  // Set the flight's status in the booking to 'Completed'
        );

        // Save the updated flight and airplane entities to the database
        await updatedFlight.save();
        await plane.save();

        // Respond with a success message
        res.status(200).json({ message: 'Flight successfully marked as completed' });

    } catch (err) {
        // If an error occurs, log it and send a 400 error response with error details
        console.log(err);
        const errors = errorHandler(err);  // Call the error handler to format the error
        res.status(400).json({ errors });
    }
}

// Function to cancel a flight and process any related refund
export const cancelPassengerFlight = async (req, res) => {
    try {
        // Extracting the booking ID and flight ID from the request body
        const { bookId, flightId } = req.body;

        // Find the booking by ID from the database
        const booking = await Booking.findById(bookId);
        
        // Find the index of the flight to be cancelled within the booking's flights array
        const flightIndex = booking.flights.findIndex(flight => flight.id === flightId);
        
        // Mark the flight status as 'Cancelled' within the booking
        booking.flights[flightIndex].status = "Cancelled";

        // Retrieve the flight details from the database
        const flight = await Flight.findById(flightId);
        const departureTime = new Date(flight.departure.time);
        const dateBeforeDeparture = new Date(departureTime);
        dateBeforeDeparture.setDate(dateBeforeDeparture.getDate() - 1);
    
        if (new Date() <= departureTime && new Date() >= dateBeforeDeparture) {
            throw new Error("You cannot cancel a flight 24 hours or less than before the departure");
        }

        // Iterate through the passengers for this flight
        booking.flights[flightIndex].passengers.forEach(passengerObj => {
            passengerObj.ticketStatus = 'Cancelled'
            // Find the class and seat index based on the class and seat number of the passenger
            const classIndex = flight.classes.findIndex(classObj => classObj.className === booking.class);
            const seatIndex = flight.classes[classIndex].seats.findIndex(seat => seat.seatNumber === passengerObj.seatNumber);
            
            // Get the seat details
            const { seatNumber, _id } = flight.classes[classIndex].seats[seatIndex];
            // Reset the seat
            flight.classes[classIndex].seats[seatIndex] = { seatNumber, status: 'available', _id };
        });
        // Find the payment related to this booking and flight
        const payment = await Payment.findOne({ booking_id: bookId, flight_id: flightId });
        
        // Set the payment status to 'refunded'
        payment.status = 'refunded';

        // Calculate the total refundable amount by summing the line items (assuming the amounts are in the smallest unit, e.g., cents)
        const refundAmount = payment.line_items.reduce((total, item) => item.amount + total, 0) * 100;
        // Save the updated booking, flight, and payment entities to the database
        await booking.save();
        await flight.save();
        await payment.save();

        // If the booking has a payment checkout ID, initiate the refund process
        if (booking.payment_checkout_id) {
            // Retrieve the payment ID using the payment checkout ID
            const payment_id = await getPaymentId(booking.payment_checkout_id);
            if (!payment_id) {
                throw new Error('Payment Id not found');  // Throw error if payment ID cannot be found
            }
        
            // Initiate the refund process with the payment ID and refund amount
            const refund = await refundPayment(payment_id, refundAmount);
            // If the refund fails, throw an error
            if (!refund) {
                throw new Error('Refund Failed');
            }
        }

        // Respond with a success message and the refund amount
        res.status(200).json({ message: 'Flight successfully cancelled', refundAmount, booking });

    } catch (err) {
        console.log(err)
        const errors = errorHandler(err);  // Call the error handler to format the error
        res.status(400).json({errors});  // Send a 400 error with the formatted errors
    }
}


export const updateFlightStatus = async (req, res) => {
    try{
         const flight = await Flight.findById(req.params.id);
         flight.status = 'In-Flight';

        await Booking.updateMany({'flights.id': flight._id, 'flights.status' : 'Booked'}, {$set: {'flights.$.status' : 'In-Flight'}})

         await flight.save();
        res.status(200).json('Flight Successfully updated')
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);  // Call the error handler to format the error
        res.status(400).json({errors});  // Send a 400 error with the formatted errors
    }
}

export const get_customer_flights = async (req, res) => {
    // Parse page and limit values from query parameters (defaults if not provided)
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 
    // Capture the search term for filtering flights (if provided)
    const searchTerm = req.query.searchTerm;
    try {
        // If a search term is provided, construct the search criteria using regular expressions for flexible matching
        const searchCriteria = searchTerm
            ? {
                $or: [
                    { 'booking_ref': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.id': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.airline': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.departure.airport': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.departure.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.departure.country': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.arrival.airport': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.arrival.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.arrival.city': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.arrival.country': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.flightNumber': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.gateNumber': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'flights.status': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'class': { $regex: new RegExp(searchTerm, 'i') } },
                    { 'fareType': { $regex: new RegExp(searchTerm, 'i') } },
                ],
                booked_by: req.userId
            }
            : {}; 
            const customerFlights = []
            const bookings = await Booking.find(searchCriteria).sort({createdAt: -1});
            bookings.forEach(booking => {
                booking.flights.forEach(flight => {
                    customerFlights.push({
                        booking_id: booking._id,
                        class: booking.class,    
                        fareType: booking.fareType, 
                        flight,
                        bookingRef: booking.booking_ref,
                        bookDate: booking.createdAt,
                        payment_method: booking.payment_checkout_id ? 'Online Payment' : 'Cash'
                      });
                })
            })
            const totalPages = Math.ceil(customerFlights.length / limit);
            res.status(200).json({
                currentPage: page,
                totalPages: totalPages,
                flights: customerFlights.slice(skip, limit * (skip + 1))
            });
    }catch(err){
        const errors= errorHandler(err);
        res.status(400).json({errors});
    }
}

export const update_flight_passengers = async (req, res) => {
    try{
        const { booking_id, flight_id, passengers } = req.body;
        const booking = await Booking.findById(booking_id);
        const flightIndex = booking.flights.findIndex(flight => flight.id === flight_id);
        booking.flights[flightIndex].passengers = passengers;

        const flight = await Flight.findById(flight_id);
        passengers.forEach(passenger => {
            const classIndex = flight.classes.findIndex(classObj => classObj.className === booking.class);
            const seatIndex = flight.classes[classIndex].seats.findIndex(seat => seat.seatNumber === passenger.seatNumber);
            console.log(flight.classes[classIndex].seats[seatIndex].passenger)
            flight.classes[classIndex].seats[seatIndex].passenger = passenger;
        })

        await booking.save();
        await flight.save();
        res.status(200).json({success: 'Flight successfully updated'});
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}