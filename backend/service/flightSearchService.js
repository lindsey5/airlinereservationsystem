import Flight from "../model/flight.js";

export const one_way_search = async (data, flightClass) =>{
    try{
        const { departureCountry, departureCity, arrivalCity, arrivalCountry } = data;
        const flights = await Flight.find({
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes.className': flightClass
        });
        if(flights.length < 1){
            throw new Error('No flights found');
        }
        return flights;
    }catch(err){
        throw new Error('No flights found');
    }
}

export const round_trip_search = async (data, flightClass) => {
    const { departureCountry, departureCity, arrivalCity, arrivalCountry } = data;
    const searchResults = {
        outboundFlights: [],
        returnFlights: []
    };

    // Fetch outbound flight results
    const outboundFlights = await Flight.find({
        'departure.country': departureCountry,
        'departure.city': departureCity,
        'arrival.city': arrivalCity,
        'arrival.country': arrivalCountry,
        'classes.className': flightClass
    });

    // Store outbound flights
    searchResults.outboundFlights = outboundFlights;

    // Fetch return flight results
    const returnFlights = await Flight.find({
        'departure.country': arrivalCountry,
        'departure.city': arrivalCity,
        'arrival.city': departureCity,
        'arrival.country': departureCountry,
        'classes.className': flightClass
    });

    // Store return flights
    searchResults.returnFlights = returnFlights;

    // Array to store the interleaved results
    const interleavedResults = [];

    // Interleave outbound and return flights
    searchResults.outboundFlights.forEach((outboundFlight) => {
        searchResults.returnFlights.forEach((returnFlight) => {
            interleavedResults.push({
                outboundFlight: outboundFlight,
                returnFlight: returnFlight
            });
        });
    });

    return interleavedResults;
};

export const multi_city_search = async (searchSegments, flightClass) => {
    const segmentResults = [];

    // Fetch flights for each search segment
    for (let segment of searchSegments) {
        const { departureCountry, departureCity, arrivalCity, arrivalCountry } = segment;

        // Find flights for the current segment
        const flights = await Flight.find({
            'departure.country': departureCountry,
            'departure.city': departureCity,
            'arrival.city': arrivalCity,
            'arrival.country': arrivalCountry,
            'classes.className': flightClass
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

    // Generate and return all flight combinations for the multi-city trip
    return generateCombinations(segmentResults);
};
