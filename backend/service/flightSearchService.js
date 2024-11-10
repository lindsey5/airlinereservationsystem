import Flight from "../model/flight.js";

export const one_way_search = async (data, flightClass, price) =>{

    try{
        const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime } = data;
        const query = {
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes': {
                $elemMatch: { className: flightClass }
            },
            'departure.time': { $gte: new Date(departureTime) }
        };
        if(price > 0) {
            query['classes.price'] = {$lte: price}
        }
        
        const flights = await Flight.find(query);

        const sortedFlights = flights.sort((current, next) => {
            return current.classes.find(classObj => classObj.className === flightClass).price - next.classes.find(classObj => classObj.className === flightClass).price;
        })
    
        const flightsArr = [];
        sortedFlights.forEach(flight => flightsArr.push([flight]));
        return flightsArr;
    }catch(err){
        throw new Error('No flights found');
    }
}

export const round_trip_search = async (data, flightClass,price) => {
    const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime } = data;
    const searchResults = {
        outboundFlights: [],
        returnFlights: []
    };

    const outBoundQuery = {
        'departure.country': departureCountry,
        'departure.city': departureCity,
        'arrival.city': arrivalCity,
        'arrival.country': arrivalCountry,
        'classes': {
            $elemMatch: { className: flightClass }
        },
        'departure.time': { $gte: new Date(departureTime) }
    };

    const returnQuery = {
        'departure.country': arrivalCountry,
        'departure.city': arrivalCity,
        'arrival.city': departureCity,
        'arrival.country': departureCountry,
        'classes': {
            $elemMatch: { className: flightClass }
        }
    }

    if(price > 0) {
        outBoundQuery['classes.price'] = {$lte: price};
        returnQuery['classes.price'] = {$lte: price}
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
            if(outboundFlight && returnFlight && new Date(returnFlight.departure.time) > new Date(outboundFlight.arrival.time)){
                interleavedResults.push([
                    outboundFlight,
                    returnFlight
                ]);
            }
        });
    });

    interleavedResults.sort((current, next) => {
        const currentPrice = current.reduce((total, flight) => {
            return total + flight.classes.reduce((classTotal, classObj) => {
                if (classObj.className === flightClass) {
                    return classTotal + classObj.price;
                }
                return classTotal;
            }, 0);
        }, 0);
    
        const nextPrice = next.reduce((total, flight) => {
            return total + flight.classes.reduce((classTotal, classObj) => {
                if (classObj.className === flightClass) {
                    return classTotal + classObj.price;
                }
                return classTotal;
            }, 0);
        }, 0);
    
        return currentPrice - nextPrice; 
    });

    return interleavedResults;
};

export const multi_city_search = async (searchSegments, flightClass) => {
    const segmentResults = [];

    // Fetch flights for each search segment
    for (let segment of searchSegments) {
        const { departureCountry, departureCity, arrivalCity, arrivalCountry, departureTime } = segment;

        // Find flights for the current segment
        const flights = await Flight.find({
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes': {
                $elemMatch: { className: flightClass }
            },
            'departure.time': { $gte: new Date(departureTime) }
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
            if (new Date(currentFlight.arrival.time) > new Date(nextFlight.departure.time)) {
                return false;
            }
        }
        return true; // Valid combination
    });

    validCombinations.sort((current, next) => {
        const currentPrice = current.reduce((total, flight) => {
            return total + flight.classes.reduce((classTotal, classObj) => {
                if (classObj.className === flightClass) {
                    return classTotal + classObj.price;
                }
                return classTotal;
            }, 0);
        }, 0);
    
        const nextPrice = next.reduce((total, flight) => {
            return total + flight.classes.reduce((classTotal, classObj) => {
                if (classObj.className === flightClass) {
                    return classTotal + classObj.price;
                }
                return classTotal;
            }, 0);
        }, 0);
    
        return currentPrice - nextPrice; 
    });

    return validCombinations;
};
