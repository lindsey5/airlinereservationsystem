export const searchFlight = async(state) => {
    const searchData = state.flights.map(flight => {
        return{
            departureCountry: flight.FromCountry,
            departureCity: flight.FromCity,
            arrivalCountry: flight.ToCountry,
            arrivalCity: flight.ToCity,
            departureTime: flight.DepartureTime
        }
    });

    try{
        const response = await fetch('/api/flight/search',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchData,
                    flightClass: state.flightClass,
                    flightType: state.flightType
                }),
            }
        );
        if(response.ok){
            const results = await response.json();
            results.forEach(result => {
                result.forEach(data => {
                    console.log(`Departure: ${data.departure.airport} ${data.departure.time}, Arrival: ${data.arrival.airport} ${data.arrival.time}`);
                });
                console.log('')
            });   
        }
    }catch(err){
        console.error(err);
    }
}