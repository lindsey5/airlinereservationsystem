import Airplane from "../model/airplane.js";
import Flight from "../model/flight.js"
import Pilot from "../model/pilot.js";
import User from "../model/user.js";
import { multi_city_search, one_way_search, round_trip_search } from "../service/flightSearchService.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { sendTickets } from "../service/emailService.js";
import Booking from "../model/Booking.js";
import { calculateSeats, createSeats, createClasses } from "../utils/flightUtils.js";
import { getPaymentId, refundPayment } from "../service/paymentService.js";
import { updatePilotStatus } from '../service/pilotService.js';

export const create_flight = async (req, res) => {
    try{
        const {airplane: {id : airplane_id}, classes, captain, co_pilot, ...data} = req.body;
        const [airplane, captainPilot, coPilot ] = await Promise.all([
            await Airplane.findById(airplane_id),
            await Pilot.findById(captain),
            await Pilot.findById(co_pilot)
        ]);
        // Manually specifying the order
        const order = ['First', 'Business', 'Economy'];

        const rearranged = order.map(name => {
            return classes.find(obj => obj.className === name);
        });

        const filtered = rearranged.filter(item => item !== undefined);

        if(!airplane){
            throw new Error('Airplane not found');
        }

        if(!captainPilot){
            throw new Error('Captain not found')
        }

        if(!coPilot){
            throw new Error('Co-pilot not found');
        }

        await Promise.all([
            captainPilot.updateOne({ status: 'Assigned' }),
            coPilot.updateOne({ status: 'Assigned' }),
            airplane.updateOne({ status: 'Assigned' })
        ]);

        if (calculateSeats(filtered) !== airplane.passengerSeatingCapacity) {
            throw new Error(`The total number of seats must equal the plane's seating capacity of ${airplane.passengerSeatingCapacity} (${airplane.columns}).`);
        }
        const newSeats = createSeats(airplane.passengerSeatingCapacity, airplane.columns);
        
        const newClasses = createClasses(filtered, newSeats);
        const flightData = {
            ...data,
            pilot: { captain, co_pilot },
            airplane: { id: airplane_id},
            classes: newClasses,
            added_by: req.userId
        }

        const newFlight = new Flight(flightData);
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

export const search_flight = async (req, res) => {
    try{
        const { searchData, flightClass, flightType, price } = req.body;
        
        let searchResults;
        if(flightType === 'One Way'){
            searchResults = await one_way_search(searchData[0], flightClass, price);
        }else if(flightType === 'Round Trip'){
            searchResults = await round_trip_search(searchData[0], flightClass, price);
        }else {
            searchResults = await multi_city_search(searchData, flightClass, price);
        }

        res.status(200).json(searchResults);
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_available_flights = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const flightClass = req.query.flightClass || 'Economy';
    try{
        const flights = await Flight.find({ 
            status: { $nin: ['Completed', 'Cancelled'] }, 
            'classes.className' : flightClass,  
            'classes.seats.status' : 'available',
            'departure.time': {$gte: new Date()}
        })
        const sortedFlights = flights.sort((current, next) => 
            current.classes.find(classObj => classObj.className === flightClass).price - 
            next.classes.find(classObj => classObj.className === flightClass).price
        )

        res.status(200).json(sortedFlights.slice(0, limit));

    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const get_flights = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;
    try{
        const searchCriteria = searchTerm
    ? {
        $or: [
            { 'departure.airport': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.airport_code': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.city': { $regex: new RegExp(searchTerm, 'i') } },
            { 'departure.country': { $regex: new RegExp(searchTerm, 'i') } },
            { 'arrival.aiport' : { $regex: new RegExp(searchTerm, 'i') }},
            { 'arrival.aiport_code' : { $regex: new RegExp(searchTerm, 'i') } },
            { 'arrival.city' : { $regex: new RegExp(searchTerm, 'i') }},
            { 'arrival.country' : { $regex: new RegExp(searchTerm, 'i') } },
            { 'airplane.id': { $regex: new RegExp(searchTerm, 'i') } },
            { 'pilot.captain': { $regex: new RegExp(searchTerm, 'i') } },
            { 'pilot.co_pilot': { $regex: new RegExp(searchTerm, 'i') } },
            { flightNumber: { $regex: new RegExp(searchTerm, 'i') } },
            { status: { $regex: new RegExp(searchTerm, 'i') }},
        ]
    }
    : {};
        const flights = await Flight.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalFlights = await Flight.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalFlights / limit);
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            flights
        });
    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const user_book_flight = async (req, res) => {
    try{
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const checkoutData = jwt.verify(req.cookies.checkoutData, process.env.JWT_SECRET);
        const user = await User.findById(id);

        for (const flight of checkoutData.data) {
            for (const passenger of flight.passengers) {
                const available_flight = await Flight.findOne({
                    _id: flight.id,
                    'classes.className': checkoutData.class,
                });

                // Find the index of the class matching the given class name
                const classIndex = available_flight.classes.findIndex(classObj => classObj.className === checkoutData.class);

                // Find the seat index that matches the passenger's seatNumber or available status
                const seatIndex = available_flight.classes[classIndex].seats.findIndex(seat => passenger.seatNumber 
                    ? passenger.seatNumber === seat.seatNumber
                    : seat.status === 'available');

                available_flight.classes[classIndex].seats[seatIndex].status = 'reserved';
                passenger.seatNumber = available_flight.classes[classIndex].seats[seatIndex].seatNumber;
                available_flight.classes[classIndex].seats[seatIndex].passenger = passenger;

                await available_flight.save();
                }
        }
    
        const flights = [];
        for (const flight of checkoutData.data) {
            const flightDetails = await Flight.findById(flight.id);
            
            const data = {
                id: flight.id,
                airline: flightDetails.airline,
                departure: flightDetails.departure,
                arrival: flightDetails.arrival,
                flightNumber: flightDetails.flightNumber,
                gate_number: flightDetails.gate_number,
                passengers: flight.passengers
            };
            flights.push(data);
        }
        const booking = await Booking.create({
            user_id: user._id,
            flights,
            class: checkoutData.class,
            fareType: checkoutData.fareType,
            payment_checkout_id: checkoutData.checkout_id
        })
        await booking.save();
        sendTickets(user.email, booking._id);
        res.redirect(`/user/booking/success`);
    }catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const frontdesk_book_flight = async (req, res) => {
        try{
            const data = {
                flights: req.body.bookings.flights, 
                class: req.body.bookings.class,
                fareType: req.body.bookings.fareType
            }
            const {name, email} = req.body.bookedBy;
            data.flights.forEach(async (flight) => {
                flight.passengers.forEach(async (passenger, i) => {
                    const available_flight = await Flight.findOne({
                        _id: flight.id, 
                        'classes.className': data.class, 
                    });
                    const classIndex =  available_flight.classes.findIndex(classObj => classObj.className === data.class);
                    const seatIndex = available_flight.classes[classIndex].seats.findIndex(seat => passenger.seatNumber?  passenger.seatNumber === seat.seatNumber :  seat.status === 'available');
    
                    if(seatIndex > -1){
                        available_flight.classes[classIndex].seats[seatIndex].status = 'reserved';
                        passenger.seatNumber = available_flight.classes[classIndex].seats[seatIndex].seatNumber
                        available_flight.classes[classIndex].seats[seatIndex].passenger = passenger;
                        await available_flight.save();
                    }
                })
            })     
            const flights = [];
            for (const flight of data.flights) {
                const flightDetails = await Flight.findById(flight.id);
                
                const data = {
                    id: flight.id,
                    airline: flightDetails.airline,
                    departure: flightDetails.departure,
                    arrival: flightDetails.arrival,
                    flightNumber: flightDetails.flightNumber,
                    gate_number: flightDetails.gate_number,
                    passengers: flight.passengers
                };
                
                flights.push(data);
            }
            const booking = await Booking.create({
                booked_by: name,
                flights,
                class: data.class,
                fareType: data.fareType
            })
            await booking.save();
            sendTickets(email, booking._id);
            res.redirect(`/user/booking/success`);
        }catch(err){
            const errors = errorHandler(err)
            res.status(400).json({errors});
        }
}

const isPilotHaveNextFlight = async (currentFlight, pilot) => {
    const flight = await Flight.findOne({
        $or: [
            {'pilot.captain' : pilot},
            {'pilot.co_pilot' : pilot} 
        ],
        'departure.airport' :currentFlight.arrival.airport,
        'departure.time' : {$gt: currentFlight.arrival.time}
    })
    return !flight ? false : true
}

const isPlaneHaveNextFlight = async(currentFlight, airplane) => {
    const flight = await Flight.findOne({
        'airplane.id' : airplane,
        'departure.airport' :currentFlight.arrival.airport,
        'departure.time' : {$gt: currentFlight.arrival.time}
    })
    return !flight ? false : true
}

export const completeFlight = async (req, res) => {
    try{
        const updatedFlight = await Flight.findById(req.params.id);
        updatedFlight.status = 'Completed'

        const plane = await Airplane.findById(updatedFlight.airplane.id);
        plane.currentLocation = updatedFlight.arrival.airport;
        const [isCaptainHaveNextFlight, isCoPilotHaveNextFlight] = await Promise.all([
            await isPilotHaveNextFlight(updatedFlight, updatedFlight.pilot.captain),
            await isPilotHaveNextFlight(updatedFlight, updatedFlight.pilot.co_pilot)
        ]);

        if(!isCaptainHaveNextFlight){
            const updatedPilot = await updatePilotStatus(updatedFlight.pilot.captain);
            if(!updatedPilot) throw new Error('Updating captain error');
        }

        if(!isCoPilotHaveNextFlight){
            const updatedPilot = await updatePilotStatus(updatedFlight.pilot.co_pilot);
            if(!updatedPilot) throw new Error('Updating captain error');
        }

        if(!await isPlaneHaveNextFlight(updatedFlight, updatedFlight.airplane.id)){
            const airplane = await Airplane.findById(updatedFlight.airplane.id);
            airplane.status = 'Available';
            await airplane.save();
        }

        await Booking.updateMany(
            { 'flights.id': req.params.id, 'flights.status': 'Booked' },
            { $set: { 'flights.$.status': 'Completed' } }
        );
        await updatedFlight.save();
        await plane.save();
        res.status(200).json({message: 'Flight successfully marked as completed'})

    }catch(err){
        console.log(err)
        const errors = errorHandler(err)
        res.status(400).json({errors});
    }
}

export const cancelFlight = async (req, res) => {
    try{
        const {bookId, flightId} = req.body
        const booking = await Booking.findById(bookId);
        const flightIndex = booking.flights.findIndex(flight => flight.id === flightId);
        booking.flights[flightIndex].status = "Cancelled"

        const flight = await Flight.findById(flightId);
        const now = new Date();

        now.setHours(0, 0, 0, 0);
        
        const departureTime = new Date(flight.departure.time);
        departureTime.setHours(0, 0, 0, 0); 
        
        const oneDayBeforeDeparture = new Date(departureTime);
        oneDayBeforeDeparture.setDate(departureTime.getDate() - 1);
        
        if (now <= departureTime && now >= oneDayBeforeDeparture) {
            throw new Error("The current date is 1 day before or equal to the departure date");
        }

        if(booking.createdAt === new Date()){
            throw new Error('You cannot cancel a flight on the day it was booked')
        }

        booking.flights[flightIndex].passengers.forEach(passengerObj => {
            const classIndex = flight.classes.findIndex(classObj => classObj.className === booking.class);
            const seatIndex = flight.classes[classIndex].seats.findIndex(seat => seat.seatNumber === passengerObj.seatNumber);
            const {seatNumber, status, _id} = flight.classes[classIndex].seats[seatIndex].passenger;
            flight.classes[classIndex].seats[seatIndex] = {seatNumber, status, _id}
        })
        const refundAmmount = (2052 * 100 * booking.flights[flightIndex].passengers.length) +
        (687.50 * 100 * booking.flights[flightIndex].passengers.length) + 
        (1296 * 100 * booking.flights[flightIndex].passengers.length) +
        (82.50 * 100 * booking.flights[flightIndex].passengers.length) +
        (30 * 100 * booking.flights[flightIndex].passengers.length) + 
        (booking.flights[flightIndex].passengers.reduce((total, passenger) => passenger.price + total, 0)) * 100;
        const payment_id = await getPaymentId(booking.payment_checkout_id);
        if(!payment_id){
            throw new Error('Payment Id not found');
        }

        const refund = await refundPayment(payment_id, refundAmmount);

        if(!refund){
            throw new Error('Refund Failed');
        }
        await booking.save();
        await flight.save();
        res.status(200).json({message: 'Flight successfully cancelled'})

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json(errors);
    }
}