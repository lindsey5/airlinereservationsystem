export const searchFlight = async(state) => {
    const searchData = state.flights.map(flight => {
        console.log(departureTime)
        return{
            departureCountry: flight.FromCountry,
            departureCity: flight.FromCity,
            arrivalCountry: flight.ToCountry,
            arrivalCity: flight.ToCity,
            departureTime
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
            console.log(await response.json());
        }

    }catch(err){
        console.error(err);
    }
}