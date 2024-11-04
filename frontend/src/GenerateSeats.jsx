import { useEffect, useState } from "react";

const GenerateSeats = (id) =>{
    const [flight, setFlight] = useState();

    useEffect(() => {
        const fetchFlight = async () => {
            try{
                const response = await fetch(`/api/flight/${id}`);
                if(response.ok){
                    const result = await response.json();
                    setFlight(result)
                }
            }catch(err){
                console.error(err);
            }
        }
        fetchFlight();
    }, [])

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
            {flight && flight.flight.classes.map(classObj => 
                 <div key={classObj._id} style={{display: "grid", gridTemplateColumns: `repeat(${flight.flight.airplane.columns}, 1fr)`}}>
                    {classObj.seats.map(seat => <button key={seat._id} value={seat.seatNumber}>{seat.seatNumber}</button>)}
                </div>
            )}
        </div>
    );

}

export default GenerateSeats;