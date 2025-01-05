import { socketInstance } from "../middleware/socket.js";
import Flight from "../model/flight.js";
import { createNotifications } from "./notificationService.js";

export const one_way_search = async (data, flightClass, price) =>{
    try{
        const now = new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        })
        const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime } = data;
        const query = {
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes': {
                $elemMatch: { className: flightClass, 'seats.status' : 'available' },
            },
            'departure.time': { $gte: now === departureTime ? new Date().setHours(new Date().getHours() + 4) : new Date(departureTime) }
        };
        const flights = await Flight.find(query);
        const sortedFlights = flights.sort((current, next) => {
            return current.classes.find(classObj => classObj.className === flightClass).price - next.classes.find(classObj => classObj.className === flightClass).price;
        }).filter((flight) => price > 0 ? flight.classes.find(classObj => classObj.className === flightClass).price <= price : true);
        const flightsArr = [];
        sortedFlights.forEach(flight => flightsArr.push([flight]))
        return flightsArr;
    }catch(err){
        console.log(err)
        throw new Error('No flights found');
    }
}

export const round_trip_search = async (data, flightClass,price, returnDate) => {
    const now = new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    })

    const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime} = data;
    const searchResults = {
        outboundFlights: [],
        returnFlights: []
    };
    const outBoundQuery = {
        status: 'Scheduled', 
        'departure.country': departureCountry,
        'departure.city': departureCity,
        'arrival.city': arrivalCity,
        'arrival.country': arrivalCountry,
        'classes': {
            $elemMatch: { className: flightClass, 'seats.status' : 'available' },
        },
        'departure.time': { $gte: now === departureTime ? new Date().setHours(new Date().getHours() + 4) : new Date(departureTime) }
    };

    const returnQuery = {
        status: 'Scheduled', 
        'departure.country': arrivalCountry,
        'departure.city': arrivalCity,
        'arrival.city': departureCity,
        'arrival.country': departureCountry,
        'classes': {
            $elemMatch: { className: flightClass, 'seats.status' : 'available' },
        },
        'departure.time': { $gte: now === departureTime ? new Date().setHours(new Date().getHours() + 4) : new Date(departureTime) }
    }

    // Fetch outbound flight results
    const outboundFlights = await Flight.find(outBoundQuery);

    // Store outbound flights
    searchResults.outboundFlights = outboundFlights;

    // Fetch return flight results
    const returnFlights = await Flight.find(returnQuery);

    // Store return flights
    searchResults.returnFlights = returnFlights;

    // Array to store the interleaved results
    const interleavedResults = [];

    // Interleave outbound and return flights
    searchResults.outboundFlights.forEach((outboundFlight) => {
        searchResults.returnFlights.forEach((returnFlight) => {
            if(outboundFlight && returnFlight && new Date(returnFlight.departure.time) > new Date(returnDate)){
                interleavedResults.push([
                    outboundFlight,
                    returnFlight
                ]);
            }
        });
    });
    const sortedFlights = interleavedResults.sort((current, next) => {
        const currentPrice = current.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
        const nextPrice = next.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
    
        return currentPrice - nextPrice; 
    }).filter(result => {
        const totalPrice = result.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
        return price > 0 ? totalPrice <= price : true
    });

    return sortedFlights;
};

export const multi_city_search = async (searchSegments, flightClass, price) => {
    const now = new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    })
    const segmentResults = [];

    // Fetch flights for each search segment
    for (let segment of searchSegments) {
        const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime } = segment;

        // Find flights for the current segment
        const flights = await Flight.find({
            status: 'Scheduled', 
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes': {
                $elemMatch: { className: flightClass, 'seats.status' : 'available' },
            },
            'departure.time': { $gte: now === departureTime ? new Date().setHours(new Date().getHours() + 4) : new Date(departureTime) }
        });
        segmentResults.push(flights);
    }

    // Generate all possible combinations of flights from each segment
    const generateCombinations = (arrays) => {
        const results = [];

        const helper = (currentCombo, depth) => {
            if (depth === arrays.length) {
                results.push([...currentCombo]);
                return;
            }

            for (let i = 0; i < arrays[depth].length; i++) {
                currentCombo.push(arrays[depth][i]);
                helper(currentCombo, depth + 1);
                currentCombo.pop();
            }
        };

        helper([], 0);
        return results;
    };

    // Generate all possible flight combinations for the multi-city trip
    const allCombinations = generateCombinations(segmentResults);

    // Filter combinations based on arrival and departure times
    const validCombinations = allCombinations.filter((combo) => {
        for (let i = 0; i < combo.length - 1; i++) {
            const currentFlight = combo[i];
            const nextFlight = combo[i + 1];
            if (new Date(nextFlight.departure.time) > new Date(currentFlight.arrival.time).setHours(new Date(currentFlight.arrival.time).getHours() + 2)) {
                return true;
            }
        }
        return false
    });

    const sortedFlights = validCombinations.sort((current, next) => {
        const currentPrice = current.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
    
        const nextPrice = next.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
    
        return currentPrice - nextPrice; 
    }).filter(result => {
        const totalPrice = result.reduce((total, flight) => {
            return total + flight.classes.find(classObj => classObj.className === flightClass).price || 0;
        }, 0);
        return price > 0 ? totalPrice <= price : true
    })

    return sortedFlights
};

export const reserveSeats = async (data) =>{
    try{
        for (const flight of data.flights) {
            let selected_flight;
            for (const passenger of flight.passengers) {
                const available_flight = await Flight.findOne({
                    _id: flight.id,
                    'classes.className': data.class,
                });
                // Find the index of the  class matching the given class name
                const classIndex = available_flight.classes.findIndex(classObj => classObj.className === data.class);
    
                // Find the seat index that matches the passenger's seatNumber or available status
                const seatIndex = available_flight.classes[classIndex].seats.findIndex(seat => passenger.seatNumber 
                    ? passenger.seatNumber === seat.seatNumber
                    : seat.status === 'available');
                
                // Check if the passenger qualifies for a discount (PWD or senior citizen)
                const isDiscounted = (passenger.pwd || passenger.senior_citizen) 
                && flight.departure_country === 'Philippines' 
                && flight.arrival_country === 'Philippines' 
                && data.class !== 'First';
                // Apply a 20% discount if the passenger qualifies for the discount
                const fareAmount = isDiscounted ? passenger.price * 0.80 : passenger.price
                passenger.price = fareAmount;
    
                available_flight.classes[classIndex].seats[seatIndex].status = 'reserved';
                passenger.seatNumber = available_flight.classes[classIndex].seats[seatIndex].seatNumber;
                available_flight.classes[classIndex].seats[seatIndex].passenger = {...passenger, book_date: new Date()};
    
                await available_flight.save();
                
                if (available_flight.classes.every(classObj => 
                    classObj.seats.every(seat => seat.status === 'reserved')
                )){
                    const notification = { message: `All seats for Flight #${available_flight.flightNumber} is fully booked.`, flight: available_flight};
                    await createNotifications(notification);
                    if(socketInstance) socketInstance.emit('notification', notification);
                }

                const fullClass = available_flight.classes.find(classObj => classObj.className === data.class && classObj.seats.every(seat => seat.status === 'reserved'));

                if(fullClass){
                    const notification = { message: `All ${fullClass.className} Class  seats for Flight #${available_flight.flightNumber} is fully booked.`, flight: available_flight};
                    await createNotifications(notification);
                    socketInstance.emit('notification', notification);
                }

                selected_flight = available_flight;
            }

            const notification = {
                message: `A new booking has been made for Flight #${selected_flight.flightNumber}.`,
                flight: selected_flight
            }
            await createNotifications(notification);
            socketInstance.emit('notification', notification);
        }
    }catch(err){
        console.log(err)
    }
}