export const searchFlight = async(flights, flightClass, flightType) => {
    const searchData = flights.map(flight => {
        return{
            departureCountry: flight.FromCountry,
            departureCity: flight.FromCity,
            arrivalCountry: flight.ToCountry,
            arrivalCity: flight.ToCity
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
                    flightClass,
                    flightType
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