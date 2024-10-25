import Flight from "../model/flight.js";

export const searchFlights = async (searchSegments, flightClass) => {
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
            'classes.className': flightClass,
            'departure.time': { $gte: departureTime }
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
